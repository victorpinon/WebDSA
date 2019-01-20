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
	            type: "POST",
	            dataType: "json",	
	            url: 'http://localhost:8080/APIGame/user/login',
	            data: JSON.stringify({
					userName: $("#user").val(),
	              	password: $("#password").val()
				}),
	            success: function(data)
	            {
	                if (data.code == 0){
	                	alert("Wrong password");
	                } else if (data.code == 1) {
	                	alert("This user is banned");
	                } else if (data.code == 2) {
	                	localStorage.setItem( "userName",  $("#user").val());
	                	window.open("scoreboardNormalUser.html", "_self");  
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

	$("#register").click(function(){
		if($("#password").val() != "" && $("#user").val()!=  ""){
			$.ajax({
			 	contentType: "application/json;charset=utf-8",
	            type: "POST",
	            dataType: "json",	
	            url: 'http://localhost:8080/APIGame/user/register',
	            data: JSON.stringify({
					userName: $("#user").val(),
	              	password: $("#password").val()
				}),
	            success: function(data)
	            {
					if (data.code == 1) {
	                	alert("Registered succesfully, please log in");
	                } else if (data.code == 2) {
	                	alert("User already exists");
	                } else if (data.code == 3) {
	                	alert("Unknown error"); 	
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
            url: 'http://localhost:8080/APIGame/user/loadUsers',
            success: function(data)
            {
                for (var i = 0; i < data.length; i++) {
                	let admin = false;
                	if(data[i].isAdmin==true){
                		admin = true;
                	}
                	let banned = false;
                	if(data[i].isBanned==true){
                		banned = true;
                	}
                	$("#userList").append("<tr> <td><b>"+data[i].userName+"</b></td> \
                							<td>"+admin+"</td> \
                							<td>"+banned+"</td> \
                							<td>"+data[i].money+"</td></tr>");
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
		localStorage.removeItem("userInfoName");
		localStorage.removeItem("userName");
		window.open("index.html", "_self");
	});

	$("#goAdminUserList").click(function(){
		localStorage.removeItem("userInfoName");
		window.open("adminUserList.html", "_self");
	});

	$("#goScoreboard").click(function(){
		localStorage.removeItem("userInfoName");
		window.open("scoreboard.html", "_self");
	});

	$("#goAllGames").click(function(){
		localStorage.removeItem("userInfoName");
		window.open("allGames.html", "_self");
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
            url: 'http://localhost:8080/APIGame/user/loadUsers',
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
                		if(data[i].isBanned == 1){
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

		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://localhost:8080/APIGame/game/gameList/'+localStorage.getItem("userInfoName"),
            success: function(data)
            {
            	if(data.length > 0){
            		for (var i = 0; i < data.length; i++) {
	                	$("#userGameList").append("<tr> <td><b>"+data[i].nameGame+"</b></td> <td>"+data[i].healthPoints+"  <span class='glyphicon glyphicon-heart'></span></td> <td>"+data[i].isCompleted+"</td> <td>"+data[i].gameLength+"</td></tr>");
                	}
            	} else {
            		$("#userGameList").html("<h4><b>This user has not played any games</b></h4>");
            	}
                
            }
        });

	}

	$("#ban").click(function(){
		$.ajax({
		 	contentType: "application/json;charset=utf-8",
			crossDomain: true,
            type: "PATCH",
            dataType: "json",
            url: 'http://localhost:8080/APIGame/user/banned/',
            data: JSON.stringify(localStorage.getItem("userInfoName")),
            success: function(data)
            {
                console.log(data);
            }
        });
        setTimeout(() => {
			window.open("adminUserInfo.html", "_self");
		}, 1000)
		
	});

	$("#admin").click(function(){
		$.ajax({
		 	contentType: "application/json;charset=utf-8",
			crossDomain: true,
            type: "PATCH",
            dataType: "json",
            url: 'http://localhost:8080/APIGame/user/admin/',
            data: JSON.stringify(localStorage.getItem("userInfoName")),
            success: function(data)
            {
                console.log(data);
            }
        });
		setTimeout(() => {
			window.open("adminUserInfo.html", "_self");
		}, 1000)
	});

	/*
	*********************************************************************************
									socreboard.html
	*********************************************************************************
	*/
	if(window.document.title == "Scoreboard"){
		$("#navBarName").text(localStorage.getItem("userName"));

		var list = [];
/*
		function fetchUserGame(userName) {
			return fetch(`http://localhost:8080/APIGame/game/gameList/${userName}`).then(response => response.json()).then(result => result)
		}

		fetch("http://localhost:8080/APIGame/user/loadUsers").then(response => response.json()).then(result => {
			result.forEach((item,index) => {
				let name = item.userName
				let userGames = fetchUserGame(name).then(result => {
					result.forEach((userGame) => {
						let completed = userGame.isCompleted == 1;

						list.push({
	                		"nameGame": userGame.nameGame,
	                		"userName": name,
	                		"gameLength": userGame.gameLength,
	                		"healthPoints": userGame.healthPoints,
	                		"isCompleted": completed
	                	});

					})
				})
			})
		})

		// No ha terminado llamada ajax, array aún está vacío
		//console.log(list)

		// Esperamos dos segundos qa que termine y se rellene la tabla
		*/

		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://localhost:8080/APIGame/user/loadUsers',
            success: function(data)
            {
            	var i;
                for (i = 0; i < data.length; i++) {
            		let name = data[i].userName;
            		$.ajax({
					 	contentType: "application/json;charset=utf-8",
			            type: "GET",
			            url: 'http://localhost:8080/APIGame/game/gameList/'+name,
			            success: function(data)
			            {
			            	var j;
			                for (j = 0; j < data.length; j++) {

			                	let completed = false;
			                	if(data[j].isCompleted == 1){
			                		completed = true;
			                	}

			                	list.push({
			                		"nameGame": data[j].nameGame,
			                		"userName": name,
			                		"gameLength": data[j].gameLength,
			                		"healthPoints": data[j].healthPoints,
			                		"isCompleted": completed
			                	});
			                }
			            }
			        });
                }
            }
        });

        setTimeout(() => {
			renderSortedTable(list)
		}, 1300)

		function sorter(item1, item2) {
			if(item1.gameLength > item2.gameLength) {
				return 1;
			} 

			if(item1.gameLength < item2.gameLength) {
				return -1;
			}

			return 0;
		}

		// Podemos delegar/abstraer el render a un metodo separado
		function renderSortedTable(list) {

			// Ordenar lista
			let sortedList = list.sort(sorter)
			//console.log(sortedList)
			for(var j = 0; j < list.length; j++){
				if(list[j].isCompleted){
					$("#scoreList").append("<tr> <td><b>"+list[j].userName+"</b></td><td>"+list[j].nameGame+"</td> <td>"+list[j].gameLength+"</td> <td>"+list[j].healthPoints+"  <span class='glyphicon glyphicon-heart'></span></td> <td>"+list[j].isCompleted+"</td></tr>");
				}
			}

		}

	}

	/*
	*********************************************************************************
									myAccount.html
	*********************************************************************************
	*/

	$("#goMyAccount").click(function(){
		window.open("myAccount.html", "_self");
	});

	$("#goNormalScoreboard").click(function(){
		window.open("scoreboardNormalUser.html", "_self");
	});

	if(window.document.title == "My Account"){
		$("#navBarName").text(localStorage.getItem("userName"));
		
		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://localhost:8080/APIGame/user/loadUsers',
            success: function(data)
            {
            	var i = 0;
                for (i = 0; i < data.length; i++) {
                	if(data[i].userName == localStorage.getItem("userName") ){
                		var admin = false;
                		if(data[i].isAdmin == 1){
                			admin = true;
                			$("#admin").text("Un-Admin");
                		}

                		var banned = false;
                		if(data[i].isBanned == 1){
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

		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://localhost:8080/APIGame/game/gameList/'+localStorage.getItem("userName"),
            success: function(data)
            {
            	if(data.length > 0){
            		for (var i = 0; i < data.length; i++) {
            			let completed = false;
            			if(data[i].isCompleted == 1){
            				completed = true;
            			}
	                	$("#userGameList").append("<tr> <td><b>"+data[i].nameGame+"</b></td> <td>"+data[i].healthPoints+"  <span class='glyphicon glyphicon-heart'></span></td> <td>"+completed+"</td> <td>"+data[i].gameLength+"</td></tr>");
                	}
            	} else {
            		$("#userGameList").html("<h4><b>You have not played any games</b></h4>");
            	}
                
            }
        });

	}

	/*
	*********************************************************************************
									allGames.html
	*********************************************************************************
	*/
	if(window.document.title == "All Games"){
		$("#navBarName").text(localStorage.getItem("userName"));

		var list = [];

		$.ajax({
		 	contentType: "application/json;charset=utf-8",
            type: "GET",
            url: 'http://localhost:8080/APIGame/user/loadUsers',
            success: function(data)
            {
            	var i;
                for (i = 0; i < data.length; i++) {
            		let name = data[i].userName;
            		$.ajax({
					 	contentType: "application/json;charset=utf-8",
			            type: "GET",
			            url: 'http://localhost:8080/APIGame/game/gameList/'+name,
			            success: function(data)
			            {
			            	var j;
			                for (j = 0; j < data.length; j++) {

			                	let completed = false;
			                	if(data[j].isCompleted == 1){
			                		completed = true;
			                	}

			                	list.push({
			                		"nameGame": data[j].nameGame,
			                		"userName": name,
			                		"gameLength": data[j].gameLength,
			                		"healthPoints": data[j].healthPoints,
			                		"isCompleted": completed
			                	});
			                }
			            }
			        });
                }
            }
        });

        setTimeout(() => {
			renderSortedTable(list)
		}, 1300)

		function sorter(item1, item2) {
			if(item1.gameLength > item2.gameLength) {
				return 1;
			} 

			if(item1.gameLength < item2.gameLength) {
				return -1;
			}

			return 0;
		}

		// Podemos delegar/abstraer el render a un metodo separado
		function renderSortedTable(list) {

			// Ordenar lista
			let sortedList = list.sort(sorter)
			//console.log(sortedList)
			for(var j = 0; j < list.length; j++){
				
				$("#gameList").append("<tr> <td><b>"+list[j].userName+"</b></td><td>"+list[j].nameGame+"</td> <td>"+list[j].gameLength+"</td> <td>"+list[j].healthPoints+"  <span class='glyphicon glyphicon-heart'></span></td> <td>"+list[j].isCompleted+"</td></tr>");
				
			}

		}

	}

});