/********************************************************************
 * Scrollable list component
 * 
 * Author: Jude Gabriel
 * Date: February 2, 2022
 * 
 * Sources: 
 * Touchable List: https://reactnative.dev/docs/flatlist
 * Constructor for list: https://www.tutorialspoint.com/what-is-the-flatlist-component-and-how-to-use-it-in-react-native
 ***********************************************************************/
 

 import React, {useEffect, useState} from 'react';
 import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Alert, Pressable, TouchableWithoutFeedback, Keyboard} from 'react-native'
 import FakeData from './FakeJobsiteData';
 import {Color} from './Palette';
 import eData from './FakeEmployeeData';
 import SearchBar from './search_bar';

import AdminJobsite from './AdminJobsite';

 import Database from '../database-communication/database.js'
import { ScrollView } from 'react-native-web';

 
 
 /**
  * Creates a Scrollable List that can be selected
  *
  * Data predefined currently (Sprint 1)
  */
class JobsList extends React.Component {
    constructor(props) {
        super(props);


        this.currValueMod = this.currValueMod.bind(this);
        this.currValueMod2 = this.currValueMod2.bind(this);
        this.initEData = eData;
        this.state = {
            FakeData: [],
            eData: [],
            stInitialFake: [],
            isModalVisible: false,
            modalTwo: false,
            address: '',
            jobName: '',
            jobPhase: '',
            jobEdited: '',
            employeeEdited: '',
            eList: null,
            eListInitital: null,
            eDataInitital: null,
            doOnce: true,
            query: '',
            query2: '',
            refresh: false,
            modalThree: false,
            jobNotes: '',
            spareNote: '',
            doOnce: true,
        };
        this.data = new Database()
    }


    /**
     * 
     * Send Job Data to AdminJobsite for Search feature
     * Harrison
     */
    sendData = () => {
        this.props.parentCallback(this.state.stInitialFake); 
    }

    /**
     * Check if component mounted
     */
    componentDidMount = () => {
        this.data.getAllJobs().then((res, rej) => {
            this.setState({FakeData: res}, () => {
            });
            this.setState({stInitialFake : res});
            this.sendData(this.state.stInitialFake);
        });
    }


    /**
     * Update the list of jobs
     */
   updateState = () => {
        this.data.getAllJobs().then((res, rej) => {
            this.setState({FakeData: res}, () => {
                this.componentDidMount();
            });
            this.setState({stInitialFake : res});
        });
    }


    static getDerivedStateFromProps(props, state) {
        //if (props.data !== state.stInitialFake) {
          return {
            FakeData : props.data 
          };
        //}  
      
    }


    /*
    Add the updated note to the db and close the modal
    */
    handleNoteSubmit(id,mess) {
        this.setModalThree(!this.state.modalThree);
        this.data.setJobNotes(id,mess);
        this.updateState();
    }


    /**
     * Updates state on SearchBar change
     * @param {*} newValue 
     */
    currValueMod(newValue) {
        this.setState({query : newValue});
 
        //Filter Data
        this.filteredItemsMod = this.getFilteredItems(this.state.query, this.state.eListInitital);
       

        if (this.filteredItemsMod != this.state.eList) {
            this.setState({eList: this.filteredItemsMod});
        }
        
        this.forceUpdate();
    }

    currValueMod2(newValue) {
        this.setState({query2 : newValue});
 
        //Filter Data
        this.filteredItemsMod2 = this.getFilteredItems(this.state.query2, this.state.eDataInitital);
       

        if (this.filteredItemsMod2 != this.state.eData) {
            this.setState({eData: this.filteredItemsMod2});
            
        }
        
        this.forceUpdate();
    }


    getFilteredItems(query, items) {

        if (!query || query.length == 0) {

          return items;
        }
        this.forceUpdate();
        return items.filter((employ) =>(employ.firstname.toString().toLowerCase() + " " + employ.lastname.toString().toLowerCase()).includes(query.toString().toLowerCase()));

      
    }


    /**
     * Set job modal visible
     */

    setModalVisible = (visible) => {
        this.setState({isModalVisible: visible});
    }


    /**
     * Set employee modal visible 
     */
    setModalTwo = (visible) => {
        this.setState({modalTwo: visible});
    }
     /**
     * Set job notes modal visible 
     */
      setModalThree = (visible) => {
        this.setState({modalThree: visible});
    }


    /**
     * Update the job address 
     */
    setAddress = (addy) => {
        this.setState({address: addy});
    }


    /**
    * Update the job notes 
    */
    setNotes = (jnote) => {
        this.setState({jobNotes: jnote})
    }

    /**
     * Updates the job phase
     * 
     * @author gabes
     */
    setPhase = (phase) => {
        this.setState({jobPhase: phase})
    }


    /**
     * Update the job name 
     */
    setJobName = (aName) => {
        this.setState({jobName: aName})
    }


    /**
     * Update which job is being edited 
     */
    setJobEdited = (edited) => {
        this.setState({jobEdited: edited});
    }


    /**
     * Update which employee is being edited 
     */
    setEmployeeEdited = (edited) => {
        this.setState({employeeEdited: edited});
    }

    /*
    set the backup note that restores the other note
    */
   setSpareNote=(edited) => {
       this.setState({spareNote: edited});
   }
    /**
     * Set active and non-active employee lists 
     */
    setEList = (id) => {
        this.data.getJobEmployeesID(id).then((res, rej) => {
            this.data.getAllAccounts().then((accResponse, accRej) => {
                this.setState({eData:this.data.getEmployeesNotOnJob(accResponse, res)});

                //Added by Harrison for Search Bar (Add employee)
                this.setState({eDataInitital: this.data.getEmployeesNotOnJob(accResponse, res)});
            })
            this.data.getJobEmployeeData(res).then((respo, rejo) => {
                this.setState({eList: respo});

                //Added by Harrison for Search Bar
                this.setState({eListInitital: respo});
            })
        });
    }


    /**
     * Delete the job
     */
    deleteJob = () => {
        this.data.deleteJob(this.state.jobEdited);
        this.updateState();
    }


    /**
     * Save the job edits 
     */
    saveJob = (edited) => {
        this.data.setJobName(this.state.jobEdited, this.state.jobName).then(() => {
            this.data.setJobAddress(this.state.jobEdited, this.state.address).then(() => {
                this.data.setJobPhase(this.state.jobEdited, this.state.jobPhase).then(() => {
                    this.setEList(this.state.jobEdited);
                    this.updateState();
                });
            });
        });
        
    }


    /**
     * Remove an employee from the job
     */
    deleteUser = () => {
        this.data.getJobEmployeesID(this.state.jobEdited).then((res, rej) => {
            for(var i = 0; i < res.length; i++){
                if(res[i].accountID == this.state.employeeEdited){
                    this.data.removeEmployeeFromJob(this.state.jobEdited, res[i].id);
                    this.setEList(this.state.jobEdited);
                    this.updateState();
                    this.props.updateList();
                }
            }
        });
    }
 

    /**
     * Add user to the job 
     */
    addUser = (item) => {
        this.data.addEmployeeToJobPriority(this.state.jobEdited, item).then( () => {
            this.setEList(this.state.jobEdited); 
            this.props.updateList();
        });
    }

 
    /**
     * Render Each job in the list
     */
    renderItem = ({item}) => {
        const { isModalVisible } = this.state;
        return (
            <View 
                id='jobsView'
                style={styles.items}>
                <TouchableOpacity 
                    id='jobListButton'
                    onPress={ () => {
                        console.log(item.phase);
                        this.setModalVisible(!isModalVisible);
                        this.setAddress(item.address);
                        this.setPhase(item.phase);
                        this.setJobName(item.name);
                        this.setJobEdited(item.id); 
                        this.setNotes(item.notes);
                        this.setSpareNote(item.notes);
                        this.setEList(item.id);
                        this.updateState();
                    }
                }>
                    <Text style={styles.jStyle} adjustsFontSizeToFit={true}  >{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    /**
     * Render list of non-active employees
     */
    renderEmployee = ({item}) => {
        const { modalTwo } = this.state;
        const { isModalVisible } = this.state;
        return (
            <View 
                id='employeeAddView'
                style={styles.items}>
                <TouchableOpacity 
                    id='employeeToAdd'
                    onPress={ () => {
                    Alert.alert(
                        'Add Employee',
                        'Add Employee to Jobsite',
                        [
                            {text: 'Yes', onPress: () =>{
                                    Alert.alert(
                                        'Employee Added', 
                                        'Employee Added to Jobsite',
                                        this.addUser(item),
                                        this.setModalTwo(!modalTwo),
                                        this.setModalVisible(!isModalVisible),
                                    )
                                }, 
                            },
                            {text: 'No', style: 'cancel'}
                        ],
                        {cancelable: false}
                    )
                }}>
                    <Text adjustsFontSizeToFit={true}  >{item.lastname + ", " + item.firstname}</Text>
                </TouchableOpacity>
            </View>
        );
    };


    /**
     * Render list of active employees 
     */



    renderList = ({item}) => {
        return(
            <View 
                id='employeeJobView'
                style={styles.items}>
                <TouchableOpacity 
                    id='employeeInJob'
                    onPress={ () => {
                    this.setEmployeeEdited(item.id);
                    Alert.alert(
                        'Remove User',
                        'Remove User from Job?',
                        [
                            {text: 'Yes', onPress: () => {
                                this.deleteUser();
                                }
                            },
                            {text: 'No'}
                        ]
                    )
                }}>
                    <Text adjustsFontSizeToFit={true} >{item.lastname + ", " + item.firstname}</Text>   
                </TouchableOpacity>
            </View>
        )
    }
 

    /**
     * Render the component
     */
    render() {
        //Send data when prop "request" is true
        if (this.state.doOnce == true) {
            this.data.getAllJobs().then((res, rej) => {
                this.setState({stInitialFake : res});
                this.sendData(this.state.stInitialFake);
            });
            this.setState({doOnce : false});
        }

        if (this.props.request ) {                 
            this.sendData();
        }

        const { isModalVisible } = this.state;
        const { modalTwo } = this.state;
        const {modalThree} = this.state;
        return (
            
            <View>
                <FlatList 
                    id='jobsList'
                    data={this.state.FakeData} 
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem} 
                    contentContainerStyle={styles.contentContainer}
                    />
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose= { () => {
                        this.setModalVisible(!isModalVisible); 
                    }}
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View  style={styles.blur}>
                                <View style={styles.modalView}>
                                    
                                    {/* EXIT BUTTON */}
                                    <View style={styles.leftView}>
                                        <TouchableOpacity id='jobModalExit' 
                                        style={[styles.button, styles.buttonClose]} 
                                        onPress={ () =>
                                        {
                                            this.setModalVisible(!isModalVisible);
                                        }}>
                                            <Text adjustsFontSizeToFit={true}  style={styles.textStyle}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    {/* JOB NAME AND ADDRESS*/}
                                    <Text adjustsFontSizeToFit={true}  style={styles.modalText}>{this.state.jobName}</Text>
                                    <Text  adjustsFontSizeToFit={true} style={styles.modalText}>{this.state.address}</Text>

                                    {/* CHANGE JOB NAME */}
                                    <View style={styles.textAndTitle}>
                                        <Text adjustsFontSizeToFit={true}  style={styles.titles}>Job Name:</Text>
                                        <TextInput 
                                            id='jobName'
                                            style={styles.textArea} 
                                            defaultValue={this.state.jobName}
                                            onChangeText={ (text) =>{
                                                this.setState({jobName: text})
                                            }}>
                                        </TextInput>
                                    </View>

                                    {/* CHANGE ADDRESS */}
                                    <View style={styles.textAndTitle}>
                                        <Text adjustsFontSizeToFit={true}  style={styles.titles}>Job Address:</Text>
                                        <TextInput 
                                            id='jobAddress'
                                            style={styles.textArea} 
                                            defaultValue={this.state.address}
                                            onChangeText={ (text) =>{
                                                this.setState({address: text})
                                            }}>
                                        </TextInput>
                                    </View>

                                {/* CHANGE JOB PHASE */}
                                <View style={styles.textAndTitle}>
                                    <Text adjustsFontSizeToFit={true}  style={styles.titles}>Job Phase:</Text>
                                    <TextInput 
                                        id='jobPhase'
                                        style={styles.textArea} 
                                        defaultValue={this.state.jobPhase}
                                        onChangeText={ (text) =>{
                                            this.setState({jobPhase: text})
                                        }}>
                                    </TextInput>
                                </View>

                                {/* SEARCH BAR */}
                                <View styles={styles.search}>
                                    <SearchBar currValue = {this.currValueMod}></SearchBar>
                                </View>

                                    <View styles={styles.listView}>
                                    {/* EMPLOYEE LIST */}
                                        <FlatList 
                                            extraData={this.state}
                                            id='employeeJobList'
                                            style={styles.list}
                                            data={this.state.eList}  
                                            keyExtractor={item => item.id.toString()}
                                            renderItem={this.renderList} 
                                        />
                                    </View>

                                    <View style={styles.saveadd}>
                                        <View style={styles.horizontalView}>
                                        {/* SAVE CHANGES */}
                                            <View style={styles.save}>
                                                <TouchableOpacity
                                                    id='saveJobChanges'
                                                    style={[styles.button, styles.buttonClose]}
                                                    onPress={ () => {
                                                            this.setModalVisible(!isModalVisible);
                                                            this.saveJob(this.state.jobEdited);
                                                        }}>
                                                        <Text  adjustsFontSizeToFit={true}  style={styles.textStyle}>Save</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* ADD EMPLOYEE */}
                                            <View style={styles.save}>
                                                <TouchableOpacity
                                                    id='updateNotes'
                                                    style={[styles.button, styles.buttonClose]}
                                                    onPress={ () => {
                                                            this.setModalVisible(!isModalVisible);
                                                            this.setModalThree(!modalThree);
                                                        }}>
                                                        <Text adjustsFontSizeToFit={true}  style={styles.textStyle}>Notes</Text>
                                                </TouchableOpacity>
                                        </View>
                                            {/* ADD EMPLOYEE */}
                                            <TouchableOpacity
                                                id='addEmployeeButton'
                                                style={[styles.button, styles.buttonClose]}
                                                onPress={ () => {
                                                        this.setModalVisible(!isModalVisible);
                                                        this.setModalTwo(!modalTwo);
                                                    }}>
                                                    <Text adjustsFontSizeToFit={true}  style={styles.textStyle}>Add Emp</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* REMOVE JOB */}
                                    <TouchableOpacity
                                        id='removeJobButton'
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={ () => {
                                                Alert.alert(
                                                    'Delete Job',
                                                    'Would you like to delete this job?',
                                                    [
                                                        {text: 'Yes', onPress: () =>{
                                                                this.deleteJob();
                                                                this.setModalVisible(!isModalVisible);
                                                            }, 
                                                        },
                                                        {text: 'No', style: 'cancel'}
                                                    ],
                                                    {cancelable: false}
                                                )
                                            }}>
                                            <Text adjustsFontSizeToFit={true}  style={styles.textStyle}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                       </TouchableWithoutFeedback>
                    </View>
                </Modal>

                {/* Add Employee Modal */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalTwo}
                    onRequestClose= { () => {
                        this.setModalTwo(!modalTwo);
                    }}>
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                <View  style={styles.blur}>
                                    <View style={styles.modalView}>
                                        
                                        {/* EXIT BUTTON */}
                                        <View style={styles.leftView}>
                                            <TouchableOpacity 
                                                id='employeeModalExit'
                                                style={[styles.button, styles.buttonClose]} 
                                                onPress={ () =>
                                                {
                                                    this.setModalTwo(!modalTwo);
                                                    this.setModalVisible(!isModalVisible);
                                                }
                                            }>
                                                <Text adjustsFontSizeToFit={true} style={styles.textStyle}>X</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Search Employees */}
                                        <Text adjustsFontSizeToFit={true}  style={styles.modalText}>Add Employee</Text>
                                        {/* SEARCH BAR */}
                                        <View styles={styles.search}>
                                            <SearchBar currValue = {this.currValueMod2}></SearchBar>
                                        </View>
                                        <FlatList 
                                            id='addEmployeeList'
                                            style={styles.list}
                                            data={this.state.eData} 
                                            keyExtractor={item => item.id.toString()}
                                            renderItem={this.renderEmployee} 
                                        />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>

                {/* Update Notes Modal */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalThree}
                    onRequestClose= { () => {
                        this.setModalThree(!modalThree);
                    }}
                >
                    <View style={styles.centeredView}>
                     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View  style={styles.blur}>
                                <View style={styles.modalViewNotes} >
                                    
                                    {/* EXIT BUTTON */}
                                    <View style={styles.leftView}>
                                        <TouchableOpacity 
                                            id='notesModalExit'
                                            style={[styles.button, styles.buttonClose]} 
                                            onPress={ () =>
                                            {
                                                this.setNotes(this.state.spareNote);
                                                this.setModalThree(!modalThree);
                                                this.setModalVisible(!isModalVisible);
                                            }
                                        }>
                                            <Text adjustsFontSizeToFit={true} style={styles.textStyle}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                        
                                        <Text adjustsFontSizeToFit={true}  style={styles.modalText}>Update Notes</Text>
                                            <View>
                                                <TextInput
                                                id='nInput'
                                                style={styles.textbox}
                                                multiline
                                                onChangeText={text => this.setNotes(text)}
                                                value={this.state.jobNotes}
                                                placeholder=" Notes for the jobsite"
                                                >
                                                </TextInput>
                                                <Pressable
                                                    id='submitButton'
                                                    style={[styles.button2, styles.buttonClose]}
                                                    onPress={() => {[
                                                        this.handleNoteSubmit(this.state.jobEdited,this.state.jobNotes),
                                                        this.setModalVisible(!isModalVisible)
                                                        
                                                        ]}}>
                                                    <Text adjustsFontSizeToFit={true} style={styles.textStyle}>Submit</Text>
                                                </Pressable>
                                            </View>
                                        
                                    
                                
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </View>
        );
    }
}
 
 
//Styles used for Scrollable list
const styles = StyleSheet.create({
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
      },
    button2: {
        borderRadius: 20,
        padding: '1%',
        marginTop: 5,
        elevation: 2,
      },
    modalViewNotes: {
        width: '90%',
        height: '50%',
        backgroundColor: 'white',
        padding: '10%',
        shadowColor: '#000',
  
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
    textbox: {
        
        borderColor: 'black',
        borderWidth: 2,
        width:'100%',
        minHeight:'50%',
        maxHeight: '50%'
      },
    horizontalView:{
        flexDirection: 'row',
        alignItems: 'center'

    },
    items: {
        padding: 20,
        borderTopWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    blur: {
        width: '100%',
        height: '100%',
        backgroundColor : 'rgba(52, 52, 52, 0.8)',
        alignItems: 'center',
        justifyContent: 'center'
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 55,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    leftView: {
        paddingLeft: 0,
        paddingRight: 200,
        paddingBottom: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      },
      button: {
        borderRadius: 20,
        padding: 15,
        elevation: 2,
        marginTop: 5
        },
        buttonOpen: {
        backgroundColor: Color.MAROON,
    },
    buttonClose: {
        backgroundColor: Color.MAROON,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center", 
        fontWeight: 'bold',
        fontSize: 20

    },
    titles: {
        padding: 15
    },
    textAndTitle: {
        flexDirection: 'row'
    },
    textArea: {
        padding: 15,
        marginBottom: 15,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15
    },
    list: {
        flexGrow: 0,
        height: 100,
        marginTop: 20
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center", 
    },
    search: {
        paddingBottom: 50,
        marginBottom: 15,

    },

    saveadd: {
        flexDirection: 'row',
       
    },

    save:{
        marginRight: 5,
    },
    contentContainer: {
        paddingBottom: 100
      },
      jStyle: {
        fontWeight: 'bold',
        color: Color.MAROON
    },
});
 
 
export default JobsList;
