var network;
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var gephiImported;
  
loadJSON("../data/airfare_all.json", redrawAll, function(err) {console.log('error')});

var container = document.getElementById('mynetwork');
var data = {
	nodes: nodes,
    edges: edges
};

var options = {
    nodes: {
      shape: 'dot',
	  mass: 1,
      font: {
        face: 'Tahoma',
		size: 25,
		strokeWidth: 12
      }
    },
    edges: {
		width: 0.51,
		smooth: {
			enabled: true,
			type: "horizontal",
			roundness: 0.5
		},
		scaling:{
			label: {
				enabled: false
			}
		},
		width: 0.1,
		selectionWidth: 10
    },
	interaction:{
		hideEdgesOnDrag: true
	},
	physics:{
		enabled: false
	}
};
network = new vis.Network(container, data, options);


// Set Map picture
var canvas;
var ctx;
canvas = network.canvas.frame.canvas;
ctx = canvas.getContext('2d');
network.on("beforeDrawing", function(ctx) {		
	ctx.drawImage(document.getElementById("MapPic"), -4625, -3525, 6555, 4300);
});
network.on("afterDrawing", function(ctx) {		
	network.fit();
});

// drawing netowrk
function redrawAll(gephiJSON) {
    if (gephiJSON.nodes === undefined) {
		gephiJSON = gephiImported;
    }
    else {
		gephiImported = gephiJSON;
    }

	nodes.clear();
    edges.clear();
   
	var parsed = vis.network.gephiParser.parseGephi(gephiJSON, {
		fixed: true,
		parseColor: true,
		inheritColor: false
    });
	
    nodes.add(parsed.nodes);
    edges.add(parsed.edges);
	
	changeWeight(weightType[weightTypeIndex]);
	network.off("afterDrawing");
}

// *** Loading and changing data ***
  
function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}
  
function loadData(path){
	loadJSON("../data/"+path, redrawAll, function(err) {console.log('error')});
	data = {
		nodes: nodes,
		edges: edges
	};
	var viewScale = network.getScale();
	var viewPosition = network.getViewPosition();
	network.setData(data);
	network.moveTo({position:{ x:viewPosition.x, y:viewPosition.y }, scale:viewScale});
	emptyContent();
}

   /* Weekdays buttons */
$("input[name='radio-weekdays']").on("change", function () {
    switch(this.id){
		case 'radio-week':
			loadData("airfare_all.json");
			break;
		case 'radio-mon':
			loadData("airfare_1mon.json");
			break;
		case 'radio-tus':
			loadData("airfare_2tus.json");
			break;
		case 'radio-wed':
			loadData("airfare_3wed.json");
			break;
		case 'radio-thu':
			loadData("airfare_4thu.json");
			break;
		case 'radio-fri':
			loadData("airfare_5fri.json");
			break;
		case 'radio-sat':
			loadData("airfare_6sat.json");
			break;
		case 'radio-sun':
			loadData("airfare_7sun.json");
			break;
	}
});

function changeWeight(attribute)
{
	var nodes_temp;
	
	if(attribute === undefined){
		nodes_temp = nodes.map(function(node) {
					node["size"] = 30;
					return node;
				});
		nodes.clear();
		nodes.add(nodes_temp);
		return;
	}
	
	var maxValue = 0;
	nodes.forEach(
		function(node) {
			if (maxValue < parseInt(node["attributes"][attribute]))
				maxValue = parseInt(node["attributes"][attribute]);
		}
	)

	nodes_temp = nodes.map(function(node) {
				if( parseInt(node["attributes"][attribute]) < 0 )
				{
					node["size"] = 10;
				}
				else
				{
					node["size"] = parseInt(node["attributes"][attribute])/maxValue*150 + 10;
				}
				return node;
			});
	nodes.clear();
	nodes.add(nodes_temp);
}
  
/* Nav buttons */
var weightType = [,"Traffic", "Arrive delay", "Departure delay"];
var weightTypeID = ['#buttonNone','#buttonTraffic','#buttonArrDelay','#buttonDepDelay'];
var weightTypeIndex = 0;
$('#buttonNone').toggleClass('navButtonClicked');
   
$("#buttonNone").click(function(){
	if(weightTypeIndex == 0) return;
	
	changeWeight();

	$(weightTypeID[weightTypeIndex]).toggleClass('navButtonClicked');
	weightTypeIndex = 0;
	$('#buttonNone').toggleClass('navButtonClicked');
})
  
$("#buttonTraffic").click(function(){
	if(weightTypeIndex == 1) return;
	
	changeWeight("Traffic");
	$(weightTypeID[weightTypeIndex]).toggleClass('navButtonClicked');
	weightTypeIndex = 1;
	$('#buttonTraffic').toggleClass('navButtonClicked');
})
  
$("#buttonArrDelay").click(function(){
	if(weightTypeIndex == 2) return;
	
	changeWeight("Arrive delay");
	$(weightTypeID[weightTypeIndex]).toggleClass('navButtonClicked');
	weightTypeIndex = 2;
	$('#buttonArrDelay').toggleClass('navButtonClicked');
})

$("#buttonDepDelay").click(function(){
	if(weightTypeIndex == 3) return;
	
  	changeWeight("Departure delay");
	$(weightTypeID[weightTypeIndex]).toggleClass('navButtonClicked');
	weightTypeIndex = 3;
	$('#buttonDepDelay').toggleClass('navButtonClicked');
})
  
// *** Article Menu Screen Center script ***
  
$("#centerScreen").click(function(){
	network.fit();
});
  
// *** Aside Menu Tabs script ***

var nodeContent = document.getElementById('networkNodeContent');
var tabTypesID = ['#contentTab','#nodeTab','#edgeTab'];
var tabClicked = 0;
$('#contentTab').toggleClass('asideMenuTabClicked');

$("#contentTab").click(function(){
	if (tabClicked != 0){

		document.getElementById("networkOptions").style.display = "none";
		nodeContent.style.display = "inline-block";
		
		$('#contentTab').toggleClass('asideMenuTabClicked');
		
		$(tabTypesID[tabClicked]).toggleClass('asideMenuTabClicked');
		tabClicked = 0;
	}
});

$("#nodeTab").click(function(){
	if (tabClicked != 1){
		options = {
			configure: {
				enabled: true,
				filter: "nodes",
				container: document.getElementById("networkOptions"),
				showButton: false
			}
		}
		if (tabClicked == 0){
			document.getElementById("networkOptions").style.display = "inline-block";
			nodeContent.style.display = "none";
		} 
		network.setOptions(options);
		$('#nodeTab').toggleClass('asideMenuTabClicked');
		
		nodes_option_filter();
		
		$(tabTypesID[tabClicked]).toggleClass('asideMenuTabClicked');
		tabClicked = 1;
	}
});

$("#edgeTab").click(function(){
	if (tabClicked != 2){
		options = {
			configure: {
				enabled: true,
				filter: "edges",
				container: document.getElementById("networkOptions"),
				showButton: false
			}
		}
		if (tabClicked == 0){
			document.getElementById("networkOptions").style.display = "inline-block";
			nodeContent.style.display = "none";
		} 
		network.setOptions(options);
		$('#edgeTab').toggleClass('asideMenuTabClicked');
		
		edges_option_filter();
		
		$(tabTypesID[tabClicked]).toggleClass('asideMenuTabClicked');
		tabClicked = 2;
	}
});

function nodes_option_filter(){
			
	div2 = document.getElementsByClassName("vis-configuration vis-config-item vis-config-s2");
	div2[1].style.display = "none";
	div2[2].style.display = "none";
	div2[3].style.display = "none";
	div2[7].style.display = "none";
	div2[8].style.display = "none";
	div2[9].style.display = "none";
	div2[12].style.display = "none";
	
	div3 = document.getElementsByClassName("vis-configuration vis-config-item vis-config-s3");
	for(var i = 0; i< 6; i++){
		div3[i].style.display = "none";
	}
	div3[12].style.display = "none";
	div3[13].style.display = "none";
	div3[14].style.display = "none";
	div3[16].style.display = "none";
	div3[17].style.display = "none";
	div3[18].style.display = "none";
	
	div4 = document.getElementsByClassName("vis-configuration vis-config-item vis-config-s4");
	for(var i = 0; i< 4; i++){
		div4[i].style.display = "none";
	}
}

function edges_option_filter(){
	document.getElementsByClassName("vis-configuration vis-config-item vis-config-s0")[0].style.height = '0px';
			
	div2 = document.getElementsByClassName("vis-configuration vis-config-item vis-config-s2");
	div2[2].style.display = "none";
	div2[4].style.display = "none";
	div2[6].style.display = "none";
	div2[7].style.display = "none";
	div2[8].style.display = "none";
	div2[9].style.display = "none";
	div2[11].style.display = "none";
	div2[12].style.display = "none";
	div2[14].style.display = "none";
	
	div3 = document.getElementsByClassName("vis-configuration vis-config-item vis-config-s3");
	for(var i = 3; i< 18; i++){
		div3[i].style.display = "none";
	}
}

network.on("configChange", function() {
		
		setTimeout(function(){ 
		if (tabClicked == 1){
			nodes_option_filter();
		}
		if(tabClicked == 2){
			edges_option_filter();
		}
		}, 0);
		
})



// Zoom node on double click
network.on('doubleClick', function (params) {
	var viewScale = network.getScale();
	if (viewScale < 0.38) viewScale = 0.38;
	if (params.nodes.length > 0) {
		network.focus(nodes.get(params.nodes[0]).id, {scale: viewScale, animation: {duration: 200}});
	}
})

// Change Content tab on node click
network.on('click', function (params) {
	if (params.nodes.length > 0) {
		var node = nodes.get(params.nodes[0]);
		var attribute = ["Airport","City","State"];
		
		nodeContent.innerHTML = "";
		nodeContent.insertAdjacentHTML('beforeend', 
			'<div class="optionTopic">node content</div>'
		);
		
		for(i=0; i < attribute.length; i++){
			nodeContent.insertAdjacentHTML('beforeend', 
				'<div class="nodeContent">' +
					'<div class="dataTopic">' + 
						'<p>' + attribute[i] + '</p>' +
					'</div><div class="dataContent">' +
						'<p>' + node["attributes"][attribute[i]] + '</p>' +
					'</div>' +
				'</div>'
			);
		}
    }
})

// Remove content from Content tab
function emptyContent(params){
	nodeContent.innerHTML = "";
		nodeContent.insertAdjacentHTML('beforeend', 
			'<div class="optionTopic">node content</div>' +
			'<br><br>' +
			'<div class="noNodeSelected">No node selected!</div>'
	);
}


network.on('deselectNode', emptyContent)