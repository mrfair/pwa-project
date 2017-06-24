var gp = {
  load : function() {

  },
  position : {
    load : function() {

    }
  },
  detail : function() {

  },
  gguserphoto : function( p ) {
    if( p[0].html_attributions[0] ) {
      var link = $( p[0].html_attributions[0] ).attr( "href" );
      return '<a target="_blank" href="' + link + '" target="gguserframe">ภาพบรรยากาศ</a>';
    }
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );

  $("#rateYo").rateYo({
    rating    : 2.5,
    spacing   : "3px",
    starWidth: "14px",
    multiColor: {
       "startColor": "#FF0000", //RED
       "endColor"  : "#00FF00"  //GREEN
    }
  });
});
