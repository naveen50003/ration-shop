(function(){

    var module = angular.module('SearchApp', []).controller('searchController',SearchController);
    
    function SearchController(){

        var _self = this;
        _self.title = "Ration Card Details";
        _self.isReadyToSave = false;
        _self.isReadyToAcceptRCNumberDeletion = false;
        _self.isReadyToAcceptRCNumberRetrival = false;
        _self.buttonClicked = false;
        _self.requiredPersons = [];
        _self.requiredPerson = {};
        _self.showRecords = false;
        _self.requiredPersons = localStorage.getItem("cardDetails") ? JSON.parse(localStorage.getItem("cardDetails")) : [];
        //console.log(_self.requiredPersons);
        /* Input JSon */
    }
    
    SearchController.prototype.retrievePatterns = function(matchers){

        var _self = this;
        //console.log(matchers);
        //console.log(_self.requiredPersons);
        _self.requiredPerson = {};
        _self.showRecords = true;
        _self.isReadyToSave = false; 
        //Get Required SKill Set Technologies
        //_self.requiredPersons = JSON.parse(localStorage.getItem("cardDetails"));
        if(Object.keys(matchers).length !== 0 && matchers.constructor === Object){
            _self.requiredPersons = [..._self.requiredPersons,matchers];
        }
        
        //console.log(_self.requiredPersons);
        localStorage.setItem("cardDetails", JSON.stringify(_self.requiredPersons));
    }

    SearchController.prototype.generateReport = function(){
        
        var _self = this;
        cardDetails = localStorage.getItem("cardDetails");
        if(cardDetails){
            _JSONToCSVConvertor(cardDetails, "Ration Report", true);
        }        
    }

    SearchController.prototype.readyToSave = function(){
        
        var _self = this;
        _self.isReadyToSave = true; 
        _self.buttonClicked = true;
    }

    SearchController.prototype.getRCNumber = function(value){

        var _self = this;
        if(value){
            _self.isReadyToAcceptRCNumberRetrival = true;
        }else{
            _self.isReadyToAcceptRCNumberDeletion = true;
        }
        _self.buttonClicked = true;
    }

    SearchController.prototype.goBack = function(){

        var _self = this;
        _self.isReadyToSave = false;
        _self.isReadyToAcceptRCNumberDeletion = false;
        _self.isReadyToAcceptRCNumberRetrival = false;
        _self.requiredPerson = null;
        _self.buttonClicked = false;
        _self.showRecords = false;
    }

    SearchController.prototype.deleteRecord = function(cardNumber){

        var _self = this;
        let id = _self.requiredPersons.findIndex(item => item.CARD_NUMBER === cardNumber);
        _self.requiredPersons.splice(id,1);
        localStorage.setItem("cardDetails", JSON.stringify(_self.requiredPersons));
        _self.cardNumber = null;
        _self.showDeleteMsg = true;
        //_self.showRecords = true;
        //console.log(_self.requiredPersons)
        //console.log(id);
    }


    /** Get Particular Record */

    SearchController.prototype.getRecord = function(cardNumber){

        var _self = this;
        let id = _self.requiredPersons.findIndex(item => item.CARD_NUMBER === cardNumber)
        _self.requiredPerson = (_self.requiredPersons.slice(id,id+1))[0];
        //_self.show = true;
        _self.cardNumber = null;
        //console.log(_self.requiredPerson)
        //console.log(id);
    }
    function _JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel){
        //console.log(JSONData);
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
        var CSV = '';    
        //Set Report title in first row or line
        
        CSV += ReportTitle + '\r\n\n';
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);
            
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);
            
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()
