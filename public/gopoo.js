var gp = {
  gguserphoto : function( p ) {
    if( p[0].html_attributions[0] ) {
      var link = $( p[0].html_attributions[0] ).attr( "href" );
      return '<a target="_blank" href="' + link + '" target="gguserframe">ภาพบรรยากาศ</a>';
    }
  },
  lo_db_convert : function( a ) {
    return a.split(".").join("_");
  },
  db_insert_place : function( d ) {
    firebase.database().ref( 'place/' + d.id ).set({
      id : d.id,
      lat: d.lat,
      lng: d.lng,
      name : d.name,
      review : []
    });
  },
  db_insert_comment : function( d ) {
    firebase.database().ref( 'place/' + d.id + '/review' ).set({
      comment : d.comment,
      rating : d.rating,
      datetime : moment().format('MMMM Do YYYY, h:mm:ss a')
    });
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );


  $("#rateYo").rateYo({
    onSet: function (rating, rateYoInstance) { 
      $( "#container_rateYo" ).attr( "data-rating", rating );
    },
    rating    : 2.5,
    maxValue: 10,
    spacing   : "3px",
    starWidth: "14px",
    multiColor: {
       "startColor": "#FF0000", //RED
       "endColor"  : "#00FF00"  //GREEN
    }
  });

  locationNow();
});
