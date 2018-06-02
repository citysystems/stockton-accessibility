//Initialize tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

//Create the map variable
var map = L.map('my-map', {
    scrollWheelZoom: false
}).setView([37.938241, -121.279106], 11);

//Add the basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);


//Function to define colors for different amenities - all same color for now
function getColorAmen(d) {
  switch (d) {
    case 'bakery':
      return '#900C3F';
    case 'beauty_salon':
      return '#900C3F';
    case 'book_store':
      return '#900C3F';
    case 'cafe':
      return '#900C3F';
    case 'clothing_store':
      return '#900C3F';
    case 'convenience_store':
      return '#900C3F';
    case 'department_store':
      return '#900C3F';
    case 'doctor':gym
      return '#900C3F';
    case 'florist':
      return '#900C3F';
    case 'gym':
      return '#900C3F';
    case 'hardware_store':
      return '#900C3F';
    case 'laundry':
      return '#900C3F';
    case 'meal_takeaway':
      return '#900C3F';
    case 'pet_store':
      return '#900C3F';
    case 'shoe_store':
      return '#900C3F';
    case 'shopping_mall':
      return '#900C3F';
    case 'pharmacy':
      return '#900C3F';
    case 'bank':
      return '#900C3F';
    case 'supermarket':
      return '#900C3F';
    case 'restaurant':
      return '#900C3F';
    default:
      return '#900C3F';
  }
};

//Initialize some variables
scores = []; //array of scores
sspz_scores = []; //array of scores in the promise zone
scores_AVG = 0; //averaged score
sspzScores_AVG = 0; //averaged score for sspz
scores_AVGBM = 0; //averaged score if distances were ideal
sspzScores_AVGBM = 0; //averaged score for SSPZ if distances were ideal
benchmark = 0;
maxScore = 0;
minScore = 0;

//Calculating population size
popTotal = 0;
popSSPZ = 0;
for(var i=0; i<pop.length; i++){
 popTotal = popTotal + pop[i].pop;
};
for(var i=0; i<sspzPop.length; i++){
  popSSPZ = popSSPZ + parseInt(sspzPop[i].popratio);
};

//The big function to calculate accessibility scores, called for each tract
function onEachFeature(feature, layer) {
  //Get values from inputs
  var absoluteAmenW = [$("#atmVal"),$("#bakeryVal"),$("#bankVal"), $("#beautySalonVal"), $("#bookStoreVal"),
    $("#busStationVal"),$("#cafeVal"), $("#clothingStoreVal"), $("#convenienceStoreVal"),
    $("#dentistVal"), $("#departmentStoreVal"), $("#doctorVal"), $("#electronicsVal"),$("#floristVal"),
      $("#furnitureStoreVal"),$("#gymVal"),$("#hairCareVal"), $("#hardwareStoreVal"),
      $("#homeStoreVal"), $("#hospitalVal"), $("#laundryVal"), $("#libraryVal"), $("#liquorStoreVal"),
      $("#takeoutVal"),$("#parkVal"),$("#petStoreVal"), $("#pharmaVal"),
    $("#restaurantVal"),$("#schoolVal"), $("#shoeStoreVal"), $("#shoppingMallVal"),
    $("#storeVal"),$("#supermarketVal"), $("#trainStationVal")];
    var marginalAmenW = [$("#atmMVal"),$("#bakeryMVal"),$("#bankMVal"), $("#beautySalonMVal"), $("#bookStoreMVal"),
      $("#busStationMVal"),$("#cafeMVal"), $("#clothingStoreMVal"), $("#convenienceStoreMVal"), $("#dentistMVal"), $("#departmentStoreMVal"), $("#doctorMVal"), $("#electronicsMVal"),$("#floristMVal"),
        $("#furnitureStoreMVal"),$("#gymMVal"),$("#hairCareMVal"), $("#hardwareStoreMVal"), $("#homeStoreMVal"), $("#hospitalMVal"), $("#laundryMVal"), $("#libraryMVal"), $("#liquorStoreMVal"),$("#takeoutMVal"),
        $("#parkMVal"),$("#petStoreMVal"), $("#pharmaMVal"),
      $("#restaurantMVal"),$("#schoolMVal"), $("#shoeStoreMVal"), $("#shoppingMallMVal"), $("#storeMVal"),$("#supermarketMVal"), $("#trainStationMVal")];
  var absoluteTransitW = [$("#walkVal"), $("#bikeVal"), $("#transitVal"), $("#driveVal")];
  var marginalTransitW = [$("#walkMVal"), $("#bikeMVal"), $("#transitMVal"), $("#driveMVal")];

  //check if values are in the right range
  for (var i = 0; i < absoluteAmenW.length; i++) {
    absoluteAmenW[i].val(parseInt(absoluteAmenW[i].val()));
      if (absoluteAmenW[i].val() > 10 ) {
          alert('Please choose values between 0 and 10! Value changed to 10 in index calculation.');
          absoluteAmenW[i].val(10);
      };
      if (absoluteAmenW[i].val() < 0) {
          alert('Please choose values between 0 and 10! Value changed to 0 in index calculation.');
          absoluteAmenW[i].val(0);
      };
    };
  for (var i = 0; i < marginalAmenW.length; i++) {
    marginalAmenW[i].val(parseInt(marginalAmenW[i].val()));
      if (marginalAmenW[i].val() > 10 ) {
          alert('Please choose values between 1 and 10! Value changed to 10 in index calculation.');
          marginalAmenW[i].val(10);
      };
      if (marginalAmenW[i].val() < 1) {
          alert('Please choose values between 1 and 10! Value changed to 1 in index calculation.');
          marginalAmenW[i].val(1);
      };
    };
  for (var i = 0; i < absoluteTransitW.length; i++) {
    absoluteTransitW[i].val(parseInt(absoluteTransitW[i].val()));
      if (absoluteTransitW[i].val() > 10 ) {
          alert('Please choose values between 0 and 10! Value changed to 10 in index calculation.');
          absoluteTransitW[i].val(10);
      };
      if (absoluteTransitW[i].val() < 0) {
          alert('Please choose values between 0 and 10! Value changed to 1 in index calculation.');
          absoluteTransitW[i].val(0);
      };
    };
  for (var i = 0; i < marginalTransitW.length; i++) {
    marginalTransitW[i].val(parseInt(marginalTransitW[i].val()));
      if (marginalTransitW[i].val() > 30 ) {
          alert('Please choose values between 1 and 30! Value changed to 10 in index calculation.');
          marginalTransitW[i].val(30);
      };
      if (marginalTransitW[i].val() < 1) {
          alert('Please choose values between 1 and 30! Value changed to 1 in index calculation.');
          marginalTransitW[i].val(1);
      };
    };

  //making weightings into integers and calculating the proper weighting scheme
  var absoluteAmenW = [parseInt($("#atmVal").val()),parseInt($("#bakeryVal").val()),parseInt($("#bankVal").val()), parseInt($("#beautySalonVal").val()), parseInt($("#bookStoreVal").val()),
    parseInt($("#busStationVal").val()),parseInt($("#cafeVal").val()), parseInt($("#clothingStoreVal").val()), parseInt($("#convenienceStoreVal").val()), parseInt($("#dentistVal").val()), parseInt($("#departmentStoreVal").val()), parseInt($("#doctorVal").val()),
    parseInt($("#electronicsVal").val()),parseInt($("#floristVal").val()),
      parseInt($("#furnitureStoreVal").val()),parseInt($("#gymVal").val()),parseInt($("#hairCareVal").val()), parseInt($("#hardwareStoreVal").val()), parseInt($("#homeStoreVal").val()), parseInt($("#hospitalVal").val()), parseInt($("#laundryVal").val()),
      parseInt($("#libraryVal").val()), parseInt($("#liquorStoreVal").val()),parseInt($("#takeoutVal").val()),
      parseInt($("#parkVal").val()),parseInt($("#petStoreVal").val()), parseInt($("#pharmaVal").val()),
    parseInt($("#restaurantVal").val()), parseInt($("#schoolVal").val()), parseInt($("#shoeStoreVal").val()), parseInt($("#shoppingMallVal").val()), parseInt($("#storeVal").val()),parseInt($("#supermarketVal").val()), parseInt($("#trainStationVal").val())];
  //marginal amenity calc: 1 - (1/(MarginalVal))
  var marginalAmenW = [(1-(1/$("#atmMVal").val())),(1-(1/$("#bakeryMVal").val())),(1-(1/$("#bankMVal").val())), (1-(1/$("#beautySalonMVal").val())), (1-(1/$("#bookStoreMVal").val())),
    (1-(1/$("#busStationMVal").val())),(1-(1/$("#cafeMVal").val())), (1-(1/$("#clothingStoreMVal").val())), (1-(1/$("#convenienceStoreMVal").val())), (1-(1/$("#dentistMVal").val())),
    (1-(1/$("#departmentStoreMVal").val())),(1-(1/$("#doctorMVal").val())),(1-(1/$("#electronicsMVal").val())),(1-(1/$("#floristMVal").val())),(1-(1/$("#furnitureStoreMVal").val())),
    (1-(1/$("#gymMVal").val())),(1-(1/$("#hairCareMVal").val())), (1-(1/$("#hardwareStoreMVal").val())), (1-(1/$("#homeStoreMVal").val())),
    (1-(1/$("#hospitalMVal").val())), (1-(1/$("#laundryMVal").val())), (1-(1/$("#libraryMVal").val())), (1-(1/$("#liquorStoreMVal").val())),(1-(1/$("#takeoutMVal").val())),
      (1-(1/$("#parkMVal").val())),(1-(1/$("#petStoreMVal").val())), (1-(1/$("#pharmaMVal").val())),
    (1-(1/$("#restaurantMVal").val())), (1-(1/$("#schoolMVal").val())), (1-(1/$("#shoeStoreMVal").val())), (1-(1/$("#shoppingMallMVal").val())), (1-(1/$("#storeMVal").val())),(1-(1/$("#supermarketMVal").val())),
    (1-(1/$("#trainStationMVal").val()))];
  var absoluteTransitW = [parseInt($("#walkVal").val()), parseInt($("#bikeVal").val()), parseInt($("#transitVal").val()), parseInt($("#driveVal").val())];
  //marginal transit calc: -ln0.1/t(minutes)
  var marginalTransitW = [((Math.log(0.1))/($("#walkMVal").val())), ((Math.log(0.1))/($("#bikeMVal").val())), ((Math.log(0.1))/($("#transitMVal").val())),
  ((Math.log(0.1))/($("#transitMVal").val()))];
  //ID to use when running through the distance matrix
  bg = layer.feature.properties.bg;
  //Initiatilizing individual score per bg/feature/layer
  score = 0;
  scoreBM = 0;
  //marginal good implementation = total transit score * MarginalAmenW(given type)^"rank"
  //util per transit: exp(marginal weighting * actual travel time)
  //marginal score per transit type, scale each according to absolute weights, sum together, marginal good weighting, scale by the absolute good weighting, add together

  //for loop for each record in the distance matrix
  for (var i = 0; i < distances.length; i++) {
    walkScore = 0;
    bikeScore = 0;
    transitScore = 0;
    driveScore = 0;
    walkScoreBM = 0;
    bikeScoreBM = 0;
    transitScoreBM = 0;
    driveScoreBM = 0;

    //Calculating the ideal agg benchmark score (before applying service weightings)
    walkScoreBM = (Math.exp(marginalTransitW[0]*$("#walkMVal").val())) * absoluteTransitW[0];
    bikeScoreBM = (Math.exp(marginalTransitW[1]*$("#bikeMVal").val())) * absoluteTransitW[1];
    transitScoreBM = (Math.exp(marginalTransitW[2]*$("#transitMVal").val())) * absoluteTransitW[2];
    driveScoreBM = (Math.exp(marginalTransitW[3]*$("#driveMVal").val())) * absoluteTransitW[3];
    aggScoreBMConstant = walkScoreBM + bikeScoreBM + transitScoreBM + driveScoreBM;
    if (distances[i].spatial_id == bg) {
      //ADDING ATMS
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_atm_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_atm_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_atm_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_atm_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[0],0)) * absoluteAmenW[0];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[0],0)) * absoluteAmenW[0];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_atm_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_atm_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_atm_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_atm_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[0],1)) * absoluteAmenW[0];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[0],1)) * absoluteAmenW[0];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_atm_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_atm_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_atm_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_atm_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[0],2)) * absoluteAmenW[0];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[0],2)) * absoluteAmenW[0];
      scoreBM += aggScoreBM;

      //ADDING BAKERIES
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bakery_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bakery_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bakery_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bakery_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[1],0)) * absoluteAmenW[1];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[1],0)) * absoluteAmenW[1];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bakery_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bakery_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bakery_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bakery_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[1],1)) * absoluteAmenW[1]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[1],1)) * absoluteAmenW[1];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bakery_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bakery_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bakery_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bakery_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[1],2)) * absoluteAmenW[1];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[1],2)) * absoluteAmenW[1];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bakery_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bakery_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bakery_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bakery_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[1],3)) * absoluteAmenW[1];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[1],3)) * absoluteAmenW[1];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bakery_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bakery_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bakery_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bakery_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[1],4)) * absoluteAmenW[1];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[1],4)) * absoluteAmenW[1];
      scoreBM += aggScoreBM;

      //ADDING BANKS
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bank_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bank_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bank_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bank_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[2],0)) * absoluteAmenW[2]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[2],0)) * absoluteAmenW[2];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bank_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bank_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bank_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bank_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[2],1)) * absoluteAmenW[2]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[2],1)) * absoluteAmenW[2];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bank_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bank_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bank_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bank_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[2],2)) * absoluteAmenW[2];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[2],2)) * absoluteAmenW[2];
      scoreBM += aggScoreBM;

      //ADDING BEAUTY SALONS
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_beauty_salon_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_beauty_salon_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_beauty_salon_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_beauty_salon_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[3],0)) * absoluteAmenW[3]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[3],0)) * absoluteAmenW[3];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_beauty_salon_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_beauty_salon_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_beauty_salon_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_beauty_salon_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[3],1)) * absoluteAmenW[3]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[3],1)) * absoluteAmenW[3];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_beauty_salon_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_beauty_salon_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_beauty_salon_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_beauty_salon_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[3],2)) * absoluteAmenW[3];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[3],2)) * absoluteAmenW[3];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_beauty_salon_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_beauty_salon_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_beauty_salon_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_beauty_salon_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[3],3)) * absoluteAmenW[3];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[3],3)) * absoluteAmenW[3];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_beauty_salon_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_beauty_salon_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_beauty_salon_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_beauty_salon_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[3],4)) * absoluteAmenW[3];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[3],4)) * absoluteAmenW[3];
      scoreBM += aggScoreBM;

      //ADDING BOOK STORES
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_book_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_book_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_book_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_book_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[4],0)) * absoluteAmenW[4]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[4],0)) * absoluteAmenW[4];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_book_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_book_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_book_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_book_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[4],1)) * absoluteAmenW[4]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[4],1)) * absoluteAmenW[4];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_book_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_book_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_book_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_book_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[4],2)) * absoluteAmenW[4];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[4],2)) * absoluteAmenW[4];
      scoreBM += aggScoreBM;

      //ADDING BUS STATIONS 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bus_station_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bus_station_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bus_station_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bus_station_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[5],0)) * absoluteAmenW[5]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[5],0)) * absoluteAmenW[5];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bus_station_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bus_station_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bus_station_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bus_station_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[5],1)) * absoluteAmenW[5]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[5],1)) * absoluteAmenW[5];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_bus_station_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_bus_station_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_bus_station_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_bus_station_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[5],2)) * absoluteAmenW[5];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[5],2)) * absoluteAmenW[5];
      scoreBM += aggScoreBM;


      //ADDING CAFES 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_cafe_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_cafe_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_cafe_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_cafe_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[6],0)) * absoluteAmenW[6]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[6],0)) * absoluteAmenW[6];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_cafe_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_cafe_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_cafe_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_cafe_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[6],1)) * absoluteAmenW[6]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[6],1)) * absoluteAmenW[6];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_cafe_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_cafe_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_cafe_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_cafe_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[6],2)) * absoluteAmenW[6];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[6],2)) * absoluteAmenW[6];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_cafe_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_cafe_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_cafe_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_cafe_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[6],3)) * absoluteAmenW[6];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[6],3)) * absoluteAmenW[6];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_cafe_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_cafe_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_cafe_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_cafe_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[6],4)) * absoluteAmenW[6];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[6],4)) * absoluteAmenW[6];
      scoreBM += aggScoreBM;

      //ADDING CLOTHING STORES 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_clothing_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_clothing_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_clothing_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_clothing_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[7],0)) * absoluteAmenW[7]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[7],0)) * absoluteAmenW[7];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_clothing_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_clothing_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_clothing_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_clothing_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[7],1)) * absoluteAmenW[7]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[7],1)) * absoluteAmenW[7];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_clothing_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_clothing_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_clothing_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_clothing_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[7],2)) * absoluteAmenW[7];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[7],2)) * absoluteAmenW[7];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_clothing_store_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_clothing_store_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_clothing_store_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_clothing_store_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[7],3)) * absoluteAmenW[7];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[7],3)) * absoluteAmenW[7];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_clothing_store_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_clothing_store_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_clothing_store_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_clothing_store_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[7],4)) * absoluteAmenW[7];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[7],4)) * absoluteAmenW[7];
      scoreBM += aggScoreBM;

      //ADDING CONVENIENCE STORES 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_convenience_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_convenience_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_convenience_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_convenience_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[8],0)) * absoluteAmenW[8]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[8],0)) * absoluteAmenW[8];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_convenience_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_convenience_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_convenience_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_convenience_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[8],1)) * absoluteAmenW[8]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[8],1)) * absoluteAmenW[8];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_convenience_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_convenience_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_convenience_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_convenience_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[8],2)) * absoluteAmenW[8];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[8],2)) * absoluteAmenW[8];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_convenience_store_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_convenience_store_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_convenience_store_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_convenience_store_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[8],3)) * absoluteAmenW[8];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[8],3)) * absoluteAmenW[8];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_convenience_store_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_convenience_store_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_convenience_store_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_convenience_store_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[8],4)) * absoluteAmenW[8];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[8],4)) * absoluteAmenW[8];
      scoreBM += aggScoreBM;

      //ADDING DENTISTS 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_dentist_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_dentist_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_dentist_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_dentist_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[9],0)) * absoluteAmenW[9]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[9],0)) * absoluteAmenW[9];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_dentist_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_dentist_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_dentist_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_dentist_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[9],1)) * absoluteAmenW[9]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[9],1)) * absoluteAmenW[9];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_dentist_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_dentist_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_dentist_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_dentist_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[9],2)) * absoluteAmenW[9];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[9],2)) * absoluteAmenW[9];
      scoreBM += aggScoreBM;

      //ADDING DEPARTMENT STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_department_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_department_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_department_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_department_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[10],0)) * absoluteAmenW[10]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[10],0)) * absoluteAmenW[10];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_department_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_department_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_department_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_department_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[10],1)) * absoluteAmenW[10]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[10],1)) * absoluteAmenW[10];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_department_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_department_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_department_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_department_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[10],2)) * absoluteAmenW[10];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[10],2)) * absoluteAmenW[10];
      scoreBM += aggScoreBM;

      //ADDING DOCTORS 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_doctor_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_doctor_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_doctor_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_doctor_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[11],0)) * absoluteAmenW[11]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[11],0)) * absoluteAmenW[11];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_doctor_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_doctor_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_doctor_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_doctor_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[11],1)) * absoluteAmenW[11]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[11],1)) * absoluteAmenW[11];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_doctor_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_doctor_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_doctor_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_doctor_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[11],2)) * absoluteAmenW[11];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[11],2)) * absoluteAmenW[11];
      scoreBM += aggScoreBM;

      //ADDING ELECTRONICS STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_electronics_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_electronics_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_electronics_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_electronics_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[12],0)) * absoluteAmenW[12]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[12],0)) * absoluteAmenW[12];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_electronics_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_electronics_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_electronics_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_electronics_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[12],1)) * absoluteAmenW[12]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[12],1)) * absoluteAmenW[12];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_electronics_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_electronics_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_electronics_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_electronics_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[12],2)) * absoluteAmenW[12];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[12],2)) * absoluteAmenW[12];
      scoreBM += aggScoreBM;

      //ADDING Florist 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_florist_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_florist_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_florist_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_florist_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[13],0)) * absoluteAmenW[13]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[13],0)) * absoluteAmenW[13];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_florist_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_florist_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_florist_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_florist_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[13],1)) * absoluteAmenW[13]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[13],1)) * absoluteAmenW[13];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_florist_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_florist_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_florist_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_florist_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[13],2)) * absoluteAmenW[13];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[13],2)) * absoluteAmenW[13];
      scoreBM += aggScoreBM;

      //ADDING FURNITURE STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_furniture_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_furniture_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_furniture_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_furniture_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[14],0)) * absoluteAmenW[14]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[14],0)) * absoluteAmenW[14];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_furniture_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_furniture_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_furniture_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_furniture_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[14],1)) * absoluteAmenW[14]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[14],1)) * absoluteAmenW[14];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_furniture_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_furniture_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_furniture_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_furniture_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[14],2)) * absoluteAmenW[14];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[14],2)) * absoluteAmenW[14];
      scoreBM += aggScoreBM;

      //ADDING GYM 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_gym_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_gym_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_gym_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_gym_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[15],0)) * absoluteAmenW[15]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[15],0)) * absoluteAmenW[15];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_gym_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_gym_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_gym_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_gym_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[15],1)) * absoluteAmenW[15]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[15],1)) * absoluteAmenW[15];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_gym_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_gym_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_gym_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_gym_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[15],2)) * absoluteAmenW[15];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[15],2)) * absoluteAmenW[15];
      scoreBM += aggScoreBM;

      //ADDING HAIR CARE STORES 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hair_care_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hair_care_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hair_care_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hair_care_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[16],0)) * absoluteAmenW[16]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[16],0)) * absoluteAmenW[16];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hair_care_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hair_care_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hair_care_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hair_care_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[16],1)) * absoluteAmenW[16]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[16],1)) * absoluteAmenW[16];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hair_care_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hair_care_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hair_care_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hair_care_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[16],2)) * absoluteAmenW[16];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[16],2)) * absoluteAmenW[16];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hair_care_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hair_care_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hair_care_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hair_care_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[16],3)) * absoluteAmenW[16];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[16],3)) * absoluteAmenW[16];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hair_care_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hair_care_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hair_care_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hair_care_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[16],4)) * absoluteAmenW[16];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[16],4)) * absoluteAmenW[16];
      scoreBM += aggScoreBM;

      //ADDING HARDWARe STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hardware_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hardware_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hardware_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hardware_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[17],0)) * absoluteAmenW[17]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[17],0)) * absoluteAmenW[17];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hardware_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hardware_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hardware_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hardware_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[17],1)) * absoluteAmenW[17]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[17],1)) * absoluteAmenW[17];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hardware_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hardware_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hardware_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hardware_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[17],2)) * absoluteAmenW[17];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[17],2)) * absoluteAmenW[17];
      scoreBM += aggScoreBM;

      //ADDING HOME GOODS STORES 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_home_goods_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_home_goods_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_home_goods_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_home_goods_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[18],0)) * absoluteAmenW[18]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[18],0)) * absoluteAmenW[18];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_home_goods_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_home_goods_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_home_goods_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_home_goods_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[18],1)) * absoluteAmenW[18]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[18],1)) * absoluteAmenW[18];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_home_goods_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_home_goods_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_home_goods_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_home_goods_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[18],2)) * absoluteAmenW[18];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[18],2)) * absoluteAmenW[18];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_home_goods_store_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_home_goods_store_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_home_goods_store_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_home_goods_store_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[18],3)) * absoluteAmenW[18];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[18],3)) * absoluteAmenW[18];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_home_goods_store_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_home_goods_store_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_home_goods_store_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_home_goods_store_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[18],4)) * absoluteAmenW[18];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[18],4)) * absoluteAmenW[18];
      scoreBM += aggScoreBM;


      //ADDING HOSPITALS 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hospital_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hospital_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hospital_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hospital_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[19],0)) * absoluteAmenW[19]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[19],0)) * absoluteAmenW[19];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hospital_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hospital_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hospital_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hospital_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[19],1)) * absoluteAmenW[19]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[19],1)) * absoluteAmenW[19];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_hospital_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_hospital_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_hospital_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_hospital_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[19],2)) * absoluteAmenW[19];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[19],2)) * absoluteAmenW[19];
      scoreBM += aggScoreBM;

      //ADDING LAUNDRY 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_laundry_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_laundry_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_laundry_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_laundry_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[20],0)) * absoluteAmenW[20]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[20],0)) * absoluteAmenW[20];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_laundry_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_laundry_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_laundry_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_laundry_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[20],1)) * absoluteAmenW[20]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[20],1)) * absoluteAmenW[20];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_laundry_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_laundry_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_laundry_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_laundry_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[20],2)) * absoluteAmenW[20];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[20],2)) * absoluteAmenW[20];
      scoreBM += aggScoreBM;

      //ADDING LIBRARY 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_library_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_library_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_library_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_library_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[21],0)) * absoluteAmenW[21]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[21],0)) * absoluteAmenW[21];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_library_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_library_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_library_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_library_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[21],1)) * absoluteAmenW[21]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[21],1)) * absoluteAmenW[21];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_library_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_library_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_library_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_library_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[21],2)) * absoluteAmenW[21];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[21],2)) * absoluteAmenW[21];
      scoreBM += aggScoreBM;

      //ADDING LIQUOR STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_liquor_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_liquor_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_liquor_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_liquor_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[22],0)) * absoluteAmenW[22]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[22],0)) * absoluteAmenW[22];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_liquor_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_liquor_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_liquor_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_liquor_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[22],1)) * absoluteAmenW[22]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[22],1)) * absoluteAmenW[22];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_liquor_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_liquor_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_liquor_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_liquor_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[22],2)) * absoluteAmenW[22];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[22],2)) * absoluteAmenW[22];
      scoreBM += aggScoreBM;

      //ADDING TAKEOUT 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_meal_takeaway_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_meal_takeaway_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_meal_takeaway_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_meal_takeaway_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[23],0)) * absoluteAmenW[23]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[23],0)) * absoluteAmenW[23];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_meal_takeaway_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_meal_takeaway_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_meal_takeaway_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_meal_takeaway_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[23],1)) * absoluteAmenW[23]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[23],1)) * absoluteAmenW[23];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_meal_takeaway_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_meal_takeaway_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_meal_takeaway_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_meal_takeaway_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[23],2)) * absoluteAmenW[23];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[23],2)) * absoluteAmenW[23];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_meal_takeaway_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_meal_takeaway_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_meal_takeaway_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_meal_takeaway_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[23],3)) * absoluteAmenW[23];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[23],3)) * absoluteAmenW[23];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_meal_takeaway_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_meal_takeaway_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_meal_takeaway_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_meal_takeaway_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[23],4)) * absoluteAmenW[23];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[23],4)) * absoluteAmenW[23];
      scoreBM += aggScoreBM;

      //ADDING PARK 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_park_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_park_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_park_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_park_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[24],0)) * absoluteAmenW[24]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[24],0)) * absoluteAmenW[24];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_park_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_park_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_park_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_park_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[24],1)) * absoluteAmenW[24]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[24],1)) * absoluteAmenW[24];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_park_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_park_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_park_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_park_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[24],2)) * absoluteAmenW[24];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[24],2)) * absoluteAmenW[24];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_park_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_park_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_park_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_park_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[24],3)) * absoluteAmenW[24];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[24],3)) * absoluteAmenW[24];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_park_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_park_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_park_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_park_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[24],4)) * absoluteAmenW[24];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[24],4)) * absoluteAmenW[24];
      scoreBM += aggScoreBM;

      //ADDING PET STORES 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pet_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pet_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pet_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pet_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[25],0)) * absoluteAmenW[25]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[25],0)) * absoluteAmenW[25];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pet_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pet_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pet_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pet_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[25],1)) * absoluteAmenW[25]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[25],1)) * absoluteAmenW[25];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pet_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pet_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pet_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pet_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[25],2)) * absoluteAmenW[25];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[25],2)) * absoluteAmenW[25];
      scoreBM += aggScoreBM;

      //ADDING PHARMACY 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pharmacy_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pharmacy_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pharmacy_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pharmacy_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[26],0)) * absoluteAmenW[26]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[26],0)) * absoluteAmenW[26];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pharmacy_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pharmacy_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pharmacy_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pharmacy_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[26],1)) * absoluteAmenW[26]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[26],1)) * absoluteAmenW[26];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_pharmacy_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_pharmacy_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_pharmacy_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_pharmacy_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[26],2)) * absoluteAmenW[26];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[26],2)) * absoluteAmenW[26];
      scoreBM += aggScoreBM;

      //ADDING RESTAURANT 10
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],0)) * absoluteAmenW[27]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],0)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],1)) * absoluteAmenW[27]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],1)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],2)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],2)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],3)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],3)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],4)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],4)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],5)) * absoluteAmenW[27]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],5)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],6)) * absoluteAmenW[27]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],6)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],7)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],7)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],8)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],8)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_restaurant_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_restaurant_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_restaurant_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_restaurant_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[27],9)) * absoluteAmenW[27];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[27],9)) * absoluteAmenW[27];
      scoreBM += aggScoreBM;

      //ADDING SCHOOLS 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_school_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_school_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_school_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_school_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[28],0)) * absoluteAmenW[28]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[28],0)) * absoluteAmenW[28];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_school_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_school_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_school_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_school_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[28],1)) * absoluteAmenW[28]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[28],1)) * absoluteAmenW[28];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_school_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_school_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_school_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_school_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[28],2)) * absoluteAmenW[28];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[28],2)) * absoluteAmenW[28];
      scoreBM += aggScoreBM;

      //ADDING SHOE STORE 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shoe_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shoe_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shoe_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shoe_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[29],0)) * absoluteAmenW[29]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[29],0)) * absoluteAmenW[29];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shoe_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shoe_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shoe_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shoe_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[29],1)) * absoluteAmenW[29]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[29],1)) * absoluteAmenW[29];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shoe_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shoe_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shoe_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shoe_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[29],2)) * absoluteAmenW[29];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[29],2)) * absoluteAmenW[29];
      scoreBM += aggScoreBM;

      //ADDING SHOPPING MALL 3
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shopping_mall_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shopping_mall_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shopping_mall_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shopping_mall_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[30],0)) * absoluteAmenW[30]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[30],0)) * absoluteAmenW[30];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shopping_mall_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shopping_mall_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shopping_mall_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shopping_mall_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[30],1)) * absoluteAmenW[30]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[30],1)) * absoluteAmenW[30];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_shopping_mall_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_shopping_mall_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_shopping_mall_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_shopping_mall_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[30],2)) * absoluteAmenW[30];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[30],2)) * absoluteAmenW[30];
      scoreBM += aggScoreBM;

      //ADDING STORE 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_store_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_store_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_store_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_store_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[31],0)) * absoluteAmenW[31]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[31],0)) * absoluteAmenW[31];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_store_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_store_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_store_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_store_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[31],1)) * absoluteAmenW[31]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[31],1)) * absoluteAmenW[31];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_store_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_store_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_store_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_store_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[31],2)) * absoluteAmenW[31];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[31],2)) * absoluteAmenW[31];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_store_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_store_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_store_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_store_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[31],3)) * absoluteAmenW[31];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[31],3)) * absoluteAmenW[31];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_store_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_store_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_store_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_store_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[31],4)) * absoluteAmenW[31];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[31],4)) * absoluteAmenW[31];
      scoreBM += aggScoreBM;

      //ADDING SUPERMARKET 5
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_supermarket_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_supermarket_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_supermarket_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_supermarket_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[32],0)) * absoluteAmenW[32]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[32],0)) * absoluteAmenW[32];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_supermarket_2)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_supermarket_2)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_supermarket_2)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_supermarket_2)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[32],1)) * absoluteAmenW[32]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[32],1)) * absoluteAmenW[32];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_supermarket_3)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_supermarket_3)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_supermarket_3)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_supermarket_3)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[32],2)) * absoluteAmenW[32];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[32],2)) * absoluteAmenW[32];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_supermarket_4)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_supermarket_4)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_supermarket_4)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_supermarket_4)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[32],3)) * absoluteAmenW[32];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[32],3)) * absoluteAmenW[32];
      scoreBM += aggScoreBM;
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_supermarket_5)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_supermarket_5)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_supermarket_5)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_supermarket_5)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[32],4)) * absoluteAmenW[32];
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[32],4)) * absoluteAmenW[32];
      scoreBM += aggScoreBM;

      //ADDING TRAIN STATION 1
      walkScore = (Math.exp(marginalTransitW[0]*distances[i].walking_train_station_1)) * absoluteTransitW[0];
      bikeScore = (Math.exp(marginalTransitW[1]*distances[i].bicycling_train_station_1)) * absoluteTransitW[1];
      transitScore = (Math.exp(marginalTransitW[2]*distances[i].transit_train_station_1)) * absoluteTransitW[2];
      driveScore = (Math.exp(marginalTransitW[3]*distances[i].driving_train_station_1)) * absoluteTransitW[3];
      aggScore = walkScore + bikeScore + transitScore + driveScore;
      aggScore = (aggScore * Math.pow(marginalAmenW[33],0)) * absoluteAmenW[33]
      score += aggScore;
      aggScoreBM = (aggScoreBMConstant * Math.pow(marginalAmenW[33],0)) * absoluteAmenW[33];
      scoreBM += aggScoreBM;
    };
  };

  //Averaging scores
  for(var i=0; i<pop.length; i++){
   if(pop[i].bg === bg){
     scores_AVG = scores_AVG + (score*pop[i].pop);
     scores_AVGBM = scores_AVGBM + (scoreBM*pop[i].pop);

   }
  };
 for(var i=0; i<sspzPop.length; i++){
  if(sspzPop[i].bg === bg){
    sspzScores_AVG = sspzScores_AVG + (score*parseInt(sspzPop[i].popratio));
    sspzScores_AVGBM = sspzScores_AVGBM + (scoreBM*parseInt(sspzPop[i].popratio));
    }
  };

  //Assigning score to the layer, creating popup and styling
  layer.feature.properties.score = score;
  if (layer.feature.properties && layer.feature.properties.score) {
      layer.bindPopup("Accessibility Score: " + layer.feature.properties.score);
  };
  layer.setStyle({
      fillColor: getColor(layer.feature.properties.score),
      weight: 1,
      // dashArray: '3 10',
      opacity: .8,
      color: "black",
      // dashArray: '3',
      fillOpacity: 0.8
  });

  //Updating max and min score
  if (score > maxScore) {
    maxScore = score;
  };
  if (score < minScore) {
    minScore = score;
  };

  //Adding score to the array of scores
  scores.push(score);
  for(var i=0; i<sspz_BGs.length; i++){
   if(sspz_BGs[i] === bg){
        sspz_scores.push(score);
   }
  }
};

//Creating Layers of Amenities
var bakery = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "bakery");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var bank = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "bank");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var beauty_salon = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "beauty_salon");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var book_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "book_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});


var cafe = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "cafe");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var clothing_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "clothing_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var convenience_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "convenience_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var department_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "department_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var doctor = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "doctor");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var florist = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "florist");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var gym = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "gym");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var hardware_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "hardware_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var laundry = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "laundry");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var restaurant = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "restaurant");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var meal_takeaway = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "meal_takeaway");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var pet_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "pet_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var pharmacy = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "pharmacy");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var shoe_store = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "shoe_store");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var shopping_mall = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "shopping_mall");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

var supermarket = L.geoJson(amenities, {
  filter: function(feature, layer) {
    return (feature.properties.Description === "supermarket");
  },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.65, color: getColorAmen(feature.properties.Description)});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            feature.properties.Name
        )
        }
});

//Adding Prelim Legend (numbers updated each updateMap call below)
var legend = L.control({
    position: 'topright'
});
function getColor(d) {
  return d > 220 ? '#4FDE02' :
      d > 204 ? '#A0EB15' :
      d > 172 ? '#E9D00E' :
      d > 156 ? '#E76607' :
      '#EC0803';
};
legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [221,205,173,157,155],
        labels = ['2 std > mean', "1-2 std > mean", '1 std from mean',
        '1-2 std < mean', '2 std < mean'];
    div.innerHTML = '<div><b>Accessibility Score</b></div>';

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;' +
            labels[i] + '<br/>';
    }

    return div;
};

legend.addTo(map);

//SECOND LEGEND - WHEN NUMBER OF AMENITY TYPES WERE SMALLER
// var legend1 = L.control({
//     position: 'bottomleft'
// });
//
// legend1.onAdd = function(map) {
//
//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = ['store', 'pharmacy', 'bank', 'supermarket', 'restaurant'];
//         labels = ["Store", "Pharmacy", "Bank", "Supermarket", "Restaurant"];
//     div.innerHTML = '<div><b>Amenity Type</b></div>';
//
//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML += '<i style="background:' + getColorAmen(grades[i]) + '">&nbsp;</i>&nbsp;&nbsp;' +
//             labels[i] + '<br/>';
//     }
//
//     return div;
// };
//
// legend1.addTo(map);
//
//

//Outline of the promise zone
var sspz = L.geoJSON(sspz, {
  style: {
        fillColor: "grey",
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: .3,

    },
});

//Create a variable to create an overlay tab of the sspz and all the amenities
var overlays = {
    "South Stockton Promise Zone" : sspz,
    "Bakery" : bakery, "Bank" : bank, "Beauty Salon" : beauty_salon,
    "Book Store": book_store, "Cafe": cafe, "Clothing Store": clothing_store,
    "Convenience Store": convenience_store,
    "Department Store" : department_store, "Doctor" : doctor, "Florist": florist,
    "Gym" : gym, "Hardware Store": hardware_store, "Laundry": laundry,"Restaurant": restaurant,
    "Takeout Restaurant" : meal_takeaway,"Pet Store": pet_store,
    "Pharmacy": pharmacy, "Shoe Store": shoe_store, "Shopping Mall" : shopping_mall,
    "Supermarket" : supermarket,
		};

//add the overlay lay to the map
L.control.layers(null, overlays).addTo(map);


//First creation of layer w/ accessibility score
var filteredLayer = L.geoJSON(blockGroups, {
  style: {
        fillColor: "black",
        weight: 2,
        // opacity: 1,
        // color: 'white',
        dashArray: '3',
        fillOpacity: 0.6
    },
  onEachFeature: onEachFeature,
});
filteredLayer.addTo(map);


//functions to calc avg and std
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
};

function standardDeviation(values){
  var sum = values.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / values.length;
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  var sum = squareDiffs.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / squareDiffs.length;
  var stdDev = Math.sqrt(avg);
  return stdDev;
};


//function to be called whenever any inputs change - resets scores and creates new layers
function updateMap() {
  maxScore = 0;
  minScore = 0;
  scores = [];
  sspz_scores = [];
  scores_AVG = 0;
  sspzScores_AVG = 0;
  scores_AVGBM = 0;
  sspzScores_AVGBM = 0;
  var features = blockGroups.features
  var FC = {
    type: 'FeatureCollection',
    features: features,
  };
  filteredLayer.clearLayers();
  // create a Leaflet geojson layer from the FeatureCollection
  filteredLayer = L.geoJSON(FC, {
    onEachFeature: onEachFeature,
  });
  var sum = scores.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var sumSSPZ = sspz_scores.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / scores.length;
  var avgSSPZ = sumSSPZ / sspz_scores.length;
  sspzScores_AVG = sspzScores_AVG/popSSPZ;
  scores_AVG = scores_AVG/popTotal;
  sspzScores_AVGBM = sspzScores_AVGBM/popSSPZ;
  scores_AVGBM = scores_AVGBM/popTotal;
  std = standardDeviation(scores);
  document.getElementById("stocktonAVG").textContent=parseInt(scores_AVG);
  document.getElementById("sspzAVG").textContent=parseInt(sspzScores_AVG);
  document.getElementById("benchmark").textContent=parseInt(scores_AVGBM);
  function getColor(d) {
    return d > (avg + 2*std) ? '#4FDE02' :
        d > (avg + std) ? '#A0EB15' :
        d > (avg - std) ? '#E9D00E' :
        d > (avg - 2*std) ? '#E76607' :
        '#EC0803';
  };
  filteredLayer.eachLayer(function(layer){
    var color = getColor(layer.feature.properties.score);
    layer.setStyle({
      fillColor: color,
      weight: 1,
      // dashArray: '3 10',
      opacity: .2,
      color: "black",

      // dashArray: '3',
      fillOpacity: 0.4
    });
  });
  filteredLayer.addTo(map);
};
//first map populated!
updateMap();
