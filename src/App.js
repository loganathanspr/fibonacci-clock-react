import React, { Component } from "react";
import "./App.css";
import _ from "underscore";

var allHourSeqs = {};
var allMinutesSeqs = {};

// define color scheme
var fibClockColors = {
  "r": "#DA3B01",
  "g": "#6BB700",
  "b": "#0063B1",
  "w": "#CBC6C4"
};

function initializeAllPossibleTimeColorMapping() {
  var bitSeqs = [];
  var redSeqs = [];
  var greenSeqs = [];
  var allTimeUnitSeq = {};
  var maxNumOSeqs = 32;
  for (let i=0; i<maxNumOSeqs; i++) {
    let bits = new Array(5);
    let red = new Array(5); 
    let green = new Array(5);
    for (let j=4; j>=0; j--) {
        bits[j] = (i & (1 << j)) !== 0;
        red[j] = (bits[j] === true)? "r": "";
        green[j] = (bits[j] === true)? "g": "";
    }
    redSeqs.push(red);
    greenSeqs.push(green);
    bitSeqs.push(bits);
  }
  for (let i=0; i<bitSeqs.length; i++) {
    let bs = bitSeqs[i];
    let timeKey = bs[0] + bs[1] + (bs[2] * 2) + (bs[3] * 3) + (bs[4] * 5);
    if (timeKey in allTimeUnitSeq) {
        allTimeUnitSeq[timeKey].push(bs);
        allHourSeqs[timeKey].push(redSeqs[i]);
        allMinutesSeqs[timeKey].push(greenSeqs[i]);
    }
    else {
        allTimeUnitSeq[timeKey] = [bs];
        allHourSeqs[timeKey] = [redSeqs[i]];
        allMinutesSeqs[timeKey] = [greenSeqs[i]];
    }
  }
}

function getColoringForTime(hh, mm) {
  var matchingHourSeqs = allHourSeqs[hh];
  var matchingMinSeqs = allMinutesSeqs[mm];
  var potentialSquareColors = [];
  for (let i=0; i<matchingHourSeqs.length; i++) {
    for(let j=0; j<matchingMinSeqs.length; j++) {
      var zipped = _.zip(matchingHourSeqs[i], matchingMinSeqs[j]);
      var colorSeq = _.map(zipped, function(hourMinArray){ return hourMinArray[0] + hourMinArray[1];});
      potentialSquareColors.push(colorSeq);
    }
  }
  var randSel = getRandomInt(0, potentialSquareColors.length);
  var colorEncoded = _.map(potentialSquareColors[randSel], function(col) {
    if (col === "r" || col === "g") {
        return col;
    }
    else if (col === "rg") {
        return "b";
    }
    else {
        return "w";
    }
  });
  return colorEncoded;
}

function getColoringForDate(dateOrig) {
  var hours = dateOrig.getHours();
  var minutes = dateOrig.getMinutes();

  if (hours > 12) {
    hours = hours - 12;
  }

  var minsScaled = Math.floor(minutes / 5);
  if (minutes === 0) {
    minsScaled = 12;
  }
  return getColoringForTime(hours, minsScaled);
}

// from MDN JavaScript reference
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Square extends Component{
  render() {
    return (
      <div style={this.props.squareProps}></div>
    );
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    initializeAllPossibleTimeColorMapping();
    var dateObj = new Date();
    var squareColors = getColoringForDate(dateObj);
    var sq1Color = fibClockColors[squareColors[0]];
    var sq2Color = fibClockColors[squareColors[1]];
    var sq3Color = fibClockColors[squareColors[2]];
    var sq4Color = fibClockColors[squareColors[3]];
    var sq5Color = fibClockColors[squareColors[4]];  

    var timeOptions = { hour12: true };
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currTime = dateObj.toLocaleTimeString("en-US", timeOptions).toString();
    var currDate = dateObj.toLocaleDateString("en-US", dateOptions).toString();

    this.state = {
      currTime: currTime,
      currDate: currDate,
      firstSqColor: sq1Color,
      secondSqColor: sq2Color,
      thirdSqColor: sq3Color,
      fourthSqColor: sq4Color,
      fifthSqColor: sq5Color        
    };
  }

  squaresUpdate() {
    var currDate = new Date();

    var squareColors = getColoringForDate(currDate);

    var sq1Color = fibClockColors[squareColors[0]];
    var sq2Color = fibClockColors[squareColors[1]];
    var sq3Color = fibClockColors[squareColors[2]];
    var sq4Color = fibClockColors[squareColors[3]];
    var sq5Color = fibClockColors[squareColors[4]];                        

    this.setState({
      squareColors: squareColors.toString(),
      firstSqColor: sq1Color,
      secondSqColor: sq2Color,
      thirdSqColor: sq3Color,
      fourthSqColor: sq4Color,
      fifthSqColor: sq5Color
    });
  }  

  timerTick() {
    var dateObj = new Date();
    var timeOptions = { hour12: true };
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currTime = dateObj.toLocaleTimeString("en-US", timeOptions).toString();
    var currDate = dateObj.toLocaleDateString("en-US", dateOptions).toString();
    this.setState({
      currTime: currTime,
      currDate: currDate
    });
  }

  componentDidMount() {
    setInterval(() => this.timerTick(), 1000);
    setInterval(() => this.squaresUpdate(), 30000);
  }

  render() {
    var clockProps = {
      height: this.props.side * 5 + 4 * this.props.spc,
      width: this.props.side * 8 + 4 * this.props.spc, 
      margin: "auto",
      position: "relative", 
    };

    // top-left square, side = 2
    var thirdSquareProps = {
      height: this.props.side * 2 + 2 * this.props.spc,
      width: this.props.side * 2,
      top: 0,
      left: 0,
      backgroundColor: this.state.thirdSqColor,
      position: "absolute"
    };

    // top-middle square, size = 1
    var firstSquareProps = {
      height: +this.props.side,
      width: +this.props.side,
      top: 0,
      left: this.props.side * 2 + 2 * this.props.spc,
      backgroundColor: this.state.firstSqColor,      
      position: "absolute"      
    };

    // middle square, size = 1
    var secondSquareProps = {
      height: +this.props.side,
      width: +this.props.side,
      top: +this.props.side + 2 * this.props.spc,
      left: this.props.side * 2 + 2 * this.props.spc,
      backgroundColor: this.state.secondSqColor,      
      position: "absolute"      
    };

    // left-bottom square, size = 3
    var fourthSquareProps = {
      height: this.props.side * 3,
      width: this.props.side * 3 + 2 * this.props.spc,
      bottom: 0,
      left: this.props.side * 0,
      backgroundColor: this.state.fourthSqColor,
      position: "absolute"      
    };    

    // right square, size = 5
    var fifthSquareProps = {
      height: this.props.side * 5 + 4 * this.props.spc,
      width: this.props.side * 5,
      top: 0,
      right: 0,
      backgroundColor: this.state.fifthSqColor,
      position: "absolute"      
    };
    return (
      <div>
        <div style={clockProps}>
          <Square squareProps={firstSquareProps} />  
          <Square squareProps={secondSquareProps} />
          <Square squareProps={thirdSquareProps} />               
          <Square squareProps={fourthSquareProps} /> 
          <Square squareProps={fifthSquareProps} /> 
        </div>
        <div>
          <p className="time">{this.state.currTime}</p>
          <p className="date">{this.state.currDate}</p>          
        </div>
      </div>
    );
  }
}

class FibonacciClockApp extends Component {
  render() {
    return (
      <div className="container">
        <Clock side="75" spc="1"/>
      </div>
    );
  }
}

export default FibonacciClockApp;