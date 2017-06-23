var gp = {
  load : function() {

  },
  position : {
    load : function() {
      $.ajax({
        url: "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=14.0347533,100.7378522&radius=10000 &keyword=ห้องน้ำ&language=th&key=AIzaSyDFU2TVjDLzdx0Q7nukpwA1xg-SHMwI8fY"
      }).done(function( j ) {
        console.log( j );
      });
    }
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );
  gp.position.load();
});
