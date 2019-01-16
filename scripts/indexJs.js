$(document).ready(function() {

	

	/*
	*********************************************************************************
									Index.html
	*********************************************************************************
	*/
	$("#logIn").click(function(){
		if($("#password").val() != "" && $("#user").val()!=  ""){
			$.ajax({
			 	contentType: "application/json;charset=utf-8",
			 	dataType: "json",
	            type: "POST",
	            url: 'http://147.83.7.203:8080/APIGame/user/login',
	            data: JSON.stringify({
					userName: $("#user").val(),
	              	password: $("#password").val()
				}),
	            success: function(data)
	            {
	                if (data.code == 0){
	                	alert("Wrong password");
	                } else if (data.code == 1) {
	                	alert("User is banned");
	                } else if (data.code == 2) {
	                	alert("Correct user");
	                	localStorage.setItem( "userName",  $("#user").val());
	                } else if (data.code == 3) {
	                	localStorage.setItem( "userName",  $("#user").val());
	                	window.open("adminUserList.html", "_self");  	
	                } else {
	                	alert("Unknown error");
	                }
	            }
        	});
		} else{
			alert("Insert a User Name and a Password please");
		}
	});


	/*
	*********************************************************************************
									adminUserList.html
	*********************************************************************************
	*/
	
	if(window.document.title == "Admin User List"){
		$("#navBarName").text(localStorage.getItem("userName"));

		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://147.83.7.203:8080/APIGame/user/loadUsers',
            success: function(data)
            {
                for (var i = 0; i < data.length; i++) {
                	$("#userList").append("<tr> <td>"+data[i].userName+"</td> <td>"+data[i].isAdmin+"</td> <td>"+data[i].isBanned+"</td> <td>"+data[i].money+"</td></tr>");
                }
            }
        });

        var myTable = document.getElementById('userList');
		myTable.addEventListener('click', function (e) {
		    var button = e.target;
		    var cell = button.parentNode.querySelectorAll("td")[0].innerText;
		    localStorage.setItem( "userInfoName",  cell);
		    window.open("adminUserInfo.html", "_self");
		}, false);
	}

	$("#logout").click(function(){
		localStorage.removeItem("userName");
		window.open("index.html", "_self");
	});

	$("#goAdminUserList").click(function(){
		window.open("adminUserList.html", "_self");
	});

	$("#goScoreboard").click(function(){
		window.open("scoreboard.html", "_self");
	});


	/*
	*********************************************************************************
									adminInfoUser.html
	*********************************************************************************
	*/

	if(window.document.title == "Admin User Info"){
		$("#navBarName").text(localStorage.getItem("userName"));
		
		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://147.83.7.203:8080/APIGame/user/loadUsers',
            success: function(data)
            {
            	var i = 0;
                for (i = 0; i < data.length; i++) {
                	if(data[i].userName == localStorage.getItem("userInfoName") ){
                		var admin = false;
                		if(data[i].isAdmin == 1){
                			admin = true;
                			$("#admin").text("Un-Admin");
                		}

                		var banned = false;
                		if(data[i].isAdmin == 1){
                			banned = true;
                			$("#ban").text("Un-Ban");
                		}

                		$("#userInfo").append(	"<h3><b>User Name: </b>"+data[i].userName+"</h3> \
                		 						<h3><b>Is admin?: </b>"+admin+"</h3>   \
                		 						<h3><b>Is banned?: </b>"+banned+"</h3>  \
                		 						<h3><b>Money: </b>"+data[i].money+"</h3>");
                		break;
                	}
                }
            }
        });
	}

	$("#ban").click(function(){
		
		//window.open("adminUserInfo.html", "_self");
	});

	$("#admin").click(function(){
		$.ajax({
		 	contentType: "application/json;charset=utf-8",
			crossDomain: true,
            type: "PATCH",
            url: 'http://147.83.7.203:8080/APIGame/user/admin/'+localStorage.getItem("userInfoName"),
            success: function(data)
            {
                console.log(data);
            }
        });
		//window.open("adminUserInfo.html", "_self");
	});






});