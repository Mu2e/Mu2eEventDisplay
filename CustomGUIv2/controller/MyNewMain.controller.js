sap.ui.define(['rootui5/eve7/controller/Main.controller',
               'rootui5/eve7/lib/EveManager',
               'rootui5/browser/controller/FileDialog.controller',
               "sap/ui/core/mvc/XMLView",
               'sap/ui/core/Fragment',
               'sap/ui/model/json/JSONModel'
], function( MainController, EveManager, FileDialogController, XMLView, Fragment, JSONModel) {
   "use strict";

   return MainController.extend("custom.MyNewMain", {

      onWebsocketClosed : function() {
         var elem = this.byId("centerTitle");
         elem.setHtmlText("<strong style=\"color: red;\">Client Disconnected: Check code for errors !</strong>");
      },

		
      onInit: function() {
         MainController.prototype.onInit.apply(this, arguments);
         this.mgr.handle.setReceiver(this);
         this.mgr.RegisterController(this);
         
			    // create model with settings
			    /*this.oModel = new JSONModel();
			    this.oModel.setData({
				    Run:			"1",
				    Event:			"1",
				    badgeCurrent:		1,
				    buttonText: 		"Go to",
				    buttonIcon: 		"sap-icon://down",
				    buttonType: 		"Default",
				    buttonWithIcon:		true,
				    buttonWithText:		true
			    });
			    this.getView().setModel(this.oModel);*/

			    // create internal vars with instances of controls
			    /*this.oLabel = this.byId("ButtonLabel");
			    this.oButton = this.byId("BadgedButton");
			    this.oRun = this.byId("RunInput");
			    this.oTest = this.byId("TestInput");
			    this.oEvent = this.byId("EventInput");
			    this.oCurrent = this.byId("CurrentValue");
			    this.oLabelCheckBox = this.byId("LabelCheckBox");
			    this.iRunValue = parseInt(this.oRun.getValue());
			    this.iEventValue = parseInt(this.oEvent.getValue());*/
			    //
          //

			    // initialize Badge
			    //this.currentChangeHandler();
      },
      
      onSaveAsFile: function(tab) {
         this.amtfn = "";
         console.log("on save as ");
                  FileDialogController.SaveAs({
                     websocket: this.mgr.handle,
                     filename: "testdialog",
                     title: "Select file name to save",
                     filter: "Any files",
                     filters: ["Text files (*.txt)", "C++ files (*.cxx *.cpp *.c)", "Any files (*)"],
                     onOk: fname => {
                        console.log("AMT test dialof ALL OK, chose ", fname);
                        let p = Math.max(fname.lastIndexOf("/"), fname.lastIndexOf("\\"));
                        let title = (p > 0) ? fname.substr(p+1) : fname;
                        this.amtfn = fname;
                        let cmd = "FileDialogSaveAs(\"" + fname + "\")";
                        this.mgr.SendMIR(cmd, this.fw2gui.fElementId, "mu2e::GUI");
                     },
                     onCancel: function() { },
                     onFailure: function() { console.log("DIALOF fail");}
                  });
               },
               
      onEveManagerInit: function() {
         MainController.prototype.onEveManagerInit.apply(this, arguments);
         var world = this.mgr.childs[0].childs;

         world.forEach((item) => {
            if (item._typename == "mu2e::GUI") {
               this.fw2gui = item;
               var pthis = this;
               this.mgr.UT_refresh_event_info = function () {
                  pthis.showEventInfo();
                  //pthis.test();
               }
               this.showEventInfo();
               this.showDate();
               //this.test();
               //this.autoplay();
               return;
            }
         });
      },

      onWebsocketMsg : function(handle, msg, offset)
      {
         this.mgr.onWebsocketMsg(handle, msg, offset);
      },
      
      showHelp : function(oEvent) {
         alert("For help and support please contact: sophie@fnal.gov");
      },
      
      showUsersGuide : function(oEvent) {
         alert("For Users Guide see https://mu2ewiki.fnal.gov/wiki/Eve7EventDisplay");
      },

      showEventInfo : function() {
         let tinfo = "Event : " + this.fw2gui.eventid + " Sub Run :" + this.fw2gui.subrunid + " Run :" + this.fw2gui.runid;
         document.title = tinfo;
         //this.byId("runInput").setValue(this.fw2gui.runid);
         //this.byId("eventInput").setValue(this.fw2gui.eventid);

         let infoLabel = this.getView().byId("infoLabel");
         console.log(infoLabel);
         infoLabel.setText(tinfo);
      },
      
      showDate : function(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        this.byId("dateInput").setValue(today);
      },
      
    test: function (oEvent) {
         console.log("AUTO", oEvent.getParameter("selected"));
         this.mgr.SendMIR("autoplay(" + oEvent.getParameter("selected") + ")", this.fw2gui.fElementId, "EventDisplayManager");
      },

    goToEvent: function (oEvent) {
         console.log("goto run = ", this.byId("runInput").getValue());
         console.log("goto event  = ", this.byId("eventInput").getValue());
         let cmd = "goToRunEvent(" + this.byId("runInput").getValue()+  ", " + this.byId("eventInput").getValue() + ")";
         this.mgr.SendMIR(cmd, this.fw2gui.fElementId, "EventDisplayManager");
      },


      
      
   });
});
