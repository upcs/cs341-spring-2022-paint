/************************************************
 * Time Card Start Menu
 * 
 * Update: added timer functionality
 * Author: Jude Gabriel 
 * 
 * Author: Harrison Winters (Build off of Jude Gabriel's Login component)
 * Date: February 5, 2022
 ************************************************/

import React from 'react';
import {Color, style} from './Palette.js';
import { Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native'
 
//Variables used for time tracking
var isPressed;
var shiftTimer;
var sec = 0;
var min = 0;
var hour = 0;


 //Company Logo with large "Start" button in the center of the screen 
 class TimeCardStart extends React.Component {

    constructor(props){
        super(props);
        this.state = {text : 'Start', time : 0};
        this.tick = this.tick.bind(this);
        this.timer = this.timer.bind(this);
        this.add = this.add.bind(this);
        this.timerOff = this.timerOff.bind(this);
        this.totalTime = this.totalTime.bind(this);
    };

    //Get the total time after the stop button is pressed
    totalTime(){
        //Get the hours
        hour = hour + Math.floor(this.state.time / 3600);
        this.setState({time: this.setState.time - (Math.floor(hour * 3600))});

        //Get the minutes
        min = min + Math.floor(this.state.time / 60);
        this.setState({time: this.setState.time - (Math.floor(min * 60))});
        //Get the seconds
        sec = sec + this.state.time;
        this.setState({time: this.setState.time = 0});

        //log the total time
        console.log(hour + ":" + min + ":" + sec);
    }

    //Turn the timer off
    timerOff(){
        clearTimeout(shiftTimer);
        this.totalTime();
    }

    //Update the time 
    tick(){
        console.log(this.state.time);
        this.setState({time: this.state.time + 1});
    };

    //Call tick to update time and reset timer
    add(){ 
        this.tick();
        this.timer();
    };

    //Call add to add time and start timer
    timer(){
        this.add
        shiftTimer = setTimeout(this.add, 1000);
    };

     //User initially pressed
    onPress = () => { 

        //Check if the user has already pressed the button
        isPressed ? (
            isPressed = false,
            this.setState({text : 'Start'}),
            this.timerOff()
        ) : (
            //Logging 
            isPressed = true,
            this.setState({text : 'Stop'}),
            this.timer() 
        );
    };

    //Render the page
     render() {
         const {text} = this.state;
         return (
             <View style={styles.container}>
                 <Image style={styles.logo} source={require('../assets/logo.jpg')} />
                 <TouchableOpacity style={isPressed ? styles.stop : styles.start} 
                 onPress={this.onPress}
                 backgroundColor='blue'>
                     <Text style={styles.text}>{text}</Text>
                 </TouchableOpacity> 
                 <Text>Today's Time: {hour} hours, {min} minutes, {sec} seconds</Text> 
             </View>
         ) 
     }
 }
 
 /*  Styling*/
 const styles = StyleSheet.create({
     container: {
         alignItems: 'center', 
         justifyContent: 'center',
         flex: 0.6,
     },
     logo: { 
         aspectRatio: 0.7, 
         resizeMode: 'contain',
         marginTop: 170,
     },
     start: {
       backgroundColor: 'green', 
       padding: 40, 
       borderRadius: 40,
       width: 250, 
       alignItems: 'center',
       marginBottom: 170,
       borderWidth: 5,
       borderColor: '#138564',
     },
     stop: {
        backgroundColor: Color.MAROON, 
        padding: 40, 
        borderRadius: 40,
        width: 250, 
        alignItems: 'center',
        marginBottom: 170,
        borderWidth: 5,
        borderColor: '#138564',
    },
     text: {
         color: 'white',
         fontSize: 40
     }
 });
 
 export default TimeCardStart;