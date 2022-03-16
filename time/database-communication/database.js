import * as firebase from 'firebase'
import 'firebase/firestore' 


/**
 * Database class
 * 
 * Holds all methods for communication with database. 
 * 
 * To use, instantiate database object and call functions to read/write data
 * 
 * @author Jude Gabriel
 */
class Database {

    /**
     * Constructor for database class
     */
    constructor(){
        const firebaseConfig = {

            apiKey: "AIzaSyBQYb6hi0bNHIrHkGL2mdKFL1lnhMFwXeU",
          
            authDomain: "paint-46970.firebaseapp.com",
          
            databaseURL: "https://paint-46970-default-rtdb.firebaseio.com",
          
            projectId: "paint-46970",
          
            storageBucket: "paint-46970.appspot.com",
          
            messagingSenderId: "54402484337",
          
            appId: "1:54402484337:web:4b9d1cb00e07cd578df3d0",
          
            measurementId: "G-Y9P77GNJTH"
          
          };

        if(firebase.apps.length == 0){
            firebase.initializeApp(firebaseConfig);  
          }
        
        this.db = firebase.firestore();
        this.userList = [];
    }



    /****** ACCOUNT GETTERS *******/

    /**
     * Gets all accounts
     * 
     * Status: Done
     * Testing: Not Done
     */
    async getAllAccounts(){
        var postData = [];
        const data = await this.db.collection("accounts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                postData.push({...doc.data(), id: doc.id})
            });
          })
        return postData;
    }

    /**
     * Gets a specific user account
     */
    getSpecificAccount(){

    }

    async getSignIn(email, password){
        var id = '';
        var user = '';
        const data = await this.db.collection("accounts").where("email", "==", email).where("password", "==", password)
                        .get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                id = doc.id
                                user = doc.data().admin;
                            })
                        })
        return [id, user];
    }

    /**
     * Gets users email
     */
    getAccountEmail(){

    }

    /**
     * Gets users first name
     */
    getUserFirst(){

    }

    /**
     * Gets users last name
     */
    getUserLast(){

    }

    /**
     * Gets users admin privelleges
     */
    getUserType(){

    }



    /****** ACCOUNT SETTERS *******/

    /**
     * Sets user type
     */
    async setUserType(id, type){
        if(id != null){
            if(type == 1){
                await this.db.collection("accounts").doc(id).update({admin: 1});
            }
            else{
                await this.db.collection("accounts").doc(id).update({admin: 0});
            }
        }
    }

    /**
     * DO WE NEED THIS???
     */
    setUserEmail(){

    }

    /**
     * Sets users firstname
     * 
     * Status: Needs to test more edge cases
     * Testing: Needed
     */
    async setUserFirst(id, first){
        if(id != null){
            await this.db.collection("accounts").doc(id).update({firstname: first});
        }
    }

    /**
     * Sets users lastname
     * 
     * Status: Needs to test more edge cases
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async setuserLast(id, last){
        if(id != null){
            await this.db.collection("accounts").doc(id).update({lastname: last});
        }
    }




    /****** CREATE ACCOUNT *******/

    /**
     * Creates a new user account
     * 
     * Status: Needs more edge cases
     * 
     * @author Jude Gabriel
     */
     createUserAccount(first, last, email, admin){
        //Error check null parameters
        first.trim();
        last.trim();
        email.trim();


        if((!first) || (!last) || (!email)){
            console.log("null parameter");
            return;
        }
        else if((first == " ") || (last == " ") || (email == " ")){
            console.log("null parameter");
            return;
        }
        else if((first == "") || (last == "") || (email == "")){
            console.log("null parameter");
            return;
        }

        //Error check for gmail account
        if(!email.includes("@gmail.com")){
            console.log("Invalid email");
            return;
        }

        //Error check admin privalleges
        if((admin != 0) && (admin != 1)){
            return;
        }


        this.db.collection("accounts").add({
            firstname: first,
            lastname: last,
            email: email,
            admin: admin
        });
     }


    /****** DELETE ACCOUNT *******/
    
    /**
     * Deletes a users account
     * 
     * Status: Need to test id edge cases
     *          Otherwise done
     * 
     * @author Jude Gabriel
     */
    async deleteUserAccount(id){
        if(id != null){
            await this.db.collection("accounts").doc(id).delete();
        }
    }


    /****** PUNCHES *******/

    /**
     * Clock in
     */
     punchIn(){

    }

    /**
     * Clock out
     */
    punchOut(){

    }

    /*
     * @author Caden 
     * @date 3/14/2022
     * 
     * Get daily time
     * STATUS: DONE
     */
    async getDailyTime(id){
        //get current date 
        let today = new Date();
        today.getDay()
        var hours = 0;
        /*
        Get the correct user using the id, and find all punches that correspond to the current day
        */
        await this.db.collection("accounts").doc(id).collection("punch").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().day == today.getDate() ){
                hours += doc.data().time;
                }
            });
          })
         return hours;
    }
    /*
    @author Caden
    @date 3/14/2022
    @param day, month, and year
    @return returns 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday... 6 - Saturday
    */
    getDayOfWeek(day, month, year){
       
    }

    /**
     * @author Caden
     * @date 3/14/2022
     * @param id of employee getting hours for
     * @return weekly hours
     * 
     * Get weekly time
     */
    async getWeeklyTime(id){
        /*
        get the day of the week through zellers rule
        */
         //get current date 
         var today = new Date();
         var hours = 0;
         var start = 0;
         var end = 0;
         var day = today.getDate();
         //Set Month in equation March is first month
         var month = today.getMonth()-1;
         if(month == 0 ){
            month =12;
         }
         else if(month == -1) {
            month = 11;
         }
         //get first two digits of the year
        var firstTwoYear = parseInt(today.getFullYear().toString().substring(0,2));
        //get last two digits of the year
        var lastTwoYear =  parseInt(today.getFullYear().toString().substring(2));
        var F = day + ((13*month-1)/5) +lastTwoYear+ (lastTwoYear/4) +(firstTwoYear/4)-(2*firstTwoYear);
        F = Math.floor(F)%7;
        /*
        Determine the start and ends of the week
        */
        switch(F){
            case 0:
                start = today.getDate() - 6;
                end = today.getDate();
                break;
            case 1:
                start = today.getDate();
                end = start + 6;
                break;
            case 2:
                start = today.getDate() - 1;
                end = start + 6;
                break;
            case 3:
                start = today.getDate() - 2;
                end = start + 6;
                break;
            case 4:
                start = today.getDate() - 3;
                end = start + 6;
                break;
            case 5:
                start = today.getDate() - 4;
                end = start + 6;
                break;
            case 6: 
                start = today.getDate() - 5;
                end = start + 6;
                break;
        }
       /*
       Return the time worked through out the week
       */
        while (start <= end){
          await this.db.collection("accounts").doc(id).collection("punch").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().day == start ){
                hours = hours + doc.data().time;
                }
            });
          })
          start++;
        }
    
    return hours;
    }

    /**
     * Get time over a specific range
     */
    getRangeTime(){
        
    }

    async getAllTime(id){
        if(id == 0){
            return;
        }
        var postData = [];
        if(id != null){
            const data = await this.db.collection("accounts").doc(id).collection("punch").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    postData.push({...doc.data(), id: doc.id})
                });
                })
            return postData;
        }
    }


    /****** JOB GETTERS *******/

    /**
     * Get all jobs 
     * 
     * Status: Needs to test more edge cases
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async getAllJobs(){
        var postData = [];
        const data = await this.db.collection("jobs").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                postData.push({...doc.data(), id: doc.id})
            });
          })
        return postData;
    }

    /**
     * Get a specific job
     */
    getSpecificJob(){

    }

    /**
     * Get job address
     */
    getJobAddress(){

    }

    /**
     * Get job name
     */
    getJobName(){

    }

    /**
     * Get job phase
     */
    getJobPhase(){

    }

    /**
     * Get a list of all employees not on the job
     * 
     * Status: Done
     * Testing: Needed
     */
    getEmployeesNotOnJob(allEmp, empOnJob){
        for(var i = 0; i < empOnJob.length; i++){
            allEmp = allEmp.filter(item => item.id !== empOnJob[i].accountID);
        }

        return allEmp;
        
    }

    /**
     * Get a list of ID's for employees on a current job
     * 
     * @author Jude Gabriel
     */
    async getJobEmployeesID(id){
        var postData = [];
        const data = await this.db.collection("jobs").doc(id).collection("employees").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                postData.push({...doc.data(), id: doc.id})
            });
          })
        return postData;
    }


    /**
     * Get data for all employees in a list
     * 
     * @author Jude Gabriel
     */
    async getJobEmployeeData(employeeID){
        var postData = [];
        for(var i = 0; i < employeeID.length; i++){
            await this.db.collection("accounts").doc(employeeID[i].accountID).get()
                .then((snapshot) => {
                    postData.push({...snapshot.data(), id: snapshot.id})
                });
        }
        return postData;
    }


    /****** JOB SETTERS *******/

    /**
     * Set job address
     * 
     * Status: Needs to test more edge cases
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async setJobAddress(id, addy){
        if(id != null){
            await this.db.collection("jobs").doc(id).update({address: addy});
        }
    }

    /**
     * Set job name
     * 
     * Status: Needs to test more edge cases
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async setJobName(id, jobname){
        if(id != null){
            await this.db.collection("jobs").doc(id).update({name: jobname});
        }
    }

    /**
     * Set job phase
     */
    setJobPhase(){

    }

    /**
     * Add employee to job
     * 
     * Status: Done
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async addEmployeeToJob(jobId, employeeToAdd){
        await this.db.collection("jobs").doc(jobId).collection("employees").add({
            accountID: employeeToAdd.id
        });
    }

    /**
     * Remove employee from job
     * 
     * Status: Done
     * Testing: Needed
     * 
     * @author Jude Gabriel
     */
    async removeEmployeeFromJob(jobID, empID){
       if((jobID != null) && (empID != null)){
        await this.db.collection("jobs").doc(jobID)
            .collection("employees").doc(empID).delete();
       }
    }

    /****** CREATE JOB *******/
    
    /**
     * Creates a job
     */
    createJob(add, jname, jnotes){
          //Trim values
          add.trim();
          jname.trim();
          jnotes.trim();
          //Phase will be 1 to start
          let phs = 1;
  
        //Error check null parameters
          if((!add) || (!jname)){
              console.log("null parameter (name or address)");
              return;
          }
          else if((add == " ") || (jname == " ") ){
              console.log("null parameter (name or address");
              return;
          }
          else if((add == "") || (jname == "")){
              console.log("null parameter (name or address)");
              return;
          }
  
          //Submit to database
          this.db.collection("jobs").add({
              address: add,
              name: jname,
              notes: jnotes,
              phase: phs
          });
    }

    /****** DELETE JOB *******/

    /**
     * Deletes a job
     */
    deleteJob(){

    }



}

export default Database;