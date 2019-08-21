var app = angular.module('demo', []);



app.controller('pollController', function($scope, $http) {

    var socket = io.connect({
        'path': window.location.pathname + 'socket.io'
      });	

      socket.emit('newClient', true)

    /*  socket.on('xo', function(d){
          console.log(d)
      })
   */

    $scope.pollData = [];
    $scope.getPollQuestion = function() {
        $http.get("/get-poll-data").then(function(resp){
            $scope.pollData = resp.data.data;
            console.log( $scope.pollData)
        })
    }
    $scope.selectedRadio = {
        value : 'Blue'
    };
    $scope.getPollQuestion(); //get data first

    $scope.vote = function() {
        console.log("vote clicked");
        console.log($scope.selectedRadio.value)
       $http.get("/poll-data").then(function(resp){
           
           var dbData = resp.data[0]['data'];
           
           for(var i in dbData) {
               if(dbData[i]['color'] == $scope.selectedRadio.value.toLowerCase()) {
                dbData[i]['value'] = dbData[i]['value'] + 1;
               }
           }
           console.log(dbData)
           
           $http.post("/update-data?id=2", {"data":dbData}).then(function(resp){
             if(resp.status == 200) {
                 alert("Thanks for voting !")
             }
          })
       })
        
    }
    
});


app.controller('pollTrackerController', function($scope, $http) {
    $scope.chartData = {
        "series": [],
        "data" : [{
            "x" : "Colors",
            "y" : [],
            "tooltip" : "Poll live results"
        }]
    }
    $scope.getChartData = function() {
        $http.get("/poll-data").then(function(resp){
            var dbData = resp.data[0]['data'];
            $scope.chartData.data[0].y = [];
            $scope.chartData.series = [];
            var chartDataX = []
            var temp = {"x" : 0, "y" : 0}
            Object.keys(dbData).forEach(function(key) {
                console.log(key['color'], dbData[key]);
                $scope.chartData.data[0].y.push(dbData[key]['value'])
                $scope.chartData.series.push(dbData[key]['color'].toUpperCase())
                temp = {"x" : temp.x + 10, "y" : dbData[key]['value']}
                chartDataX.push(temp)
            });
            console.log(chartDataX)
            createChart(chartDataX)
        })
    }
    $scope.getChartData();
    var socket = io.connect('http://localhost:3000');

    socket.on('xo', function(data) {
        console.log(data);
       // alert("refresh")
       $scope.getChartData();
    });


    function createChart(dps) {
        var chart = new CanvasJS.Chart("chartContainer", {
          title: {
            text: "Chart using AngularJS"
          },
          data: [{
            dataPoints: dps
          }]
        });
        chart.render();
      }
      


});