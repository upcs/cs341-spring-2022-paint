/************************************************
 * Admin Jobsite Page
 * 
 * Author: Harrison Winters
 * Date: February 5, 2022
 ************************************************/

 import React from 'react';
 import {Color} from './Palette.js';
 import { Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native'
 import { useState } from 'react';
 import TimeSheetList from './TimeSheetList.js';
 import SearchBar from './search_bar.js';
import EmployeesList from './EmployeesList.js';  
import AddEmployee from './AddEmployee.js';


 //Jobsite Selection with a search bar and "add jobsite" button
 class AdminEmployee extends React.Component {
     constructor(props){
         super(props);
         this.currValue = this.currValue.bind(this);
         this.callbackFunction = this.callbackFunction.bind(this);

         this.state = {
            query: [],
            jobsDataChild: [],
            requesting: false,
          };

         //get a reference of the updateState from EmployeeList
        this.myref = React.createRef();
     }

     

    setQuery(newQuery) {
      return newQuery;

    }

    //Added
    //Callback Function from JobsList
    callbackFunction(childData) {
      this.setState({jobsDataChild : childData});
      this.setState({requesting : false});
      console.log('callback recieved');
    }
    

    getFilteredItems(query, items) {
      console.log("query: %s", query);
      if (!query || query.length == 0) {
        console.log("returning all items");
        console.log(items);
        return items;
      }
      console.log("filtering data based on query, query was: " + query);
      return items.filter((jobs) => (jobs.firstname.toString().toLowerCase() + " " + jobs.lastname.toString().toLowerCase() ).includes(query.toString().toLowerCase()));
    }

    currValue(newValue) {
      //console.log(newValue);
      this.setState({query : newValue});
      console.log(this.state.query);

      this.setState({requesting : true});
      
      console.log(this.state.requesting);
      this.forceUpdate();
      
    }
     
     render() {
       //This function is called whenever the add employee modal is submitted
        const addData = (params) => {
            employList = params;
            //Call reference to updateState
            this.myref.current.updateState();
        }

         return (
             <View style={styles.container}>
                 <View style={styles.upperbar}>
                    <SearchBar style={styles.search} currValue = {this.currValue}></SearchBar>
                    
                    <View style={styles.buttonContainer}>
                        <AddEmployee sendData={addData} ></AddEmployee>
                    </View>
                    
                    
                </View>
                <EmployeesList ref={this.myref} query={this.state.query} request={this.state.requesting} parentCallback={this.callbackFunction} data={this.filteredItems}></EmployeesList>
             </View>
         ) 
     }
 }
 
 /*  Styles used for login screen */
 const styles = StyleSheet.create({
     container: {
        //  alignItems: 'center', 
        //  justifyContent: 'center',
        //  flex: 0.8
        
     },

     upperbar: {
        
        display: 'flex',
        flexDirection: 'row',
        
     },

    //  logo: { 
    //      aspectRatio: 0.9, 
    //      resizeMode: 'contain'
    //  },
     add: {
       backgroundColor: Color.MAROON, 
       padding: 20, 
       marginTop: 12,
       borderRadius: 30,
       width: 100, 
       height: 10,
       alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
       marginHorizontal: 50,
       
    
     },
     text: {
         color: 'white',
         fontSize: 14,    
        position: 'absolute',
        // margin: 'auto',
        textAlign: 'center',
    },

    buttonContainer: {
       justifyContent: 'center', 
       position: 'relative',
    }
 });
 
 export default AdminEmployee;