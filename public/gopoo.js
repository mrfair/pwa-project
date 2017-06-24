var gp = {
  gguserphoto : function( p ) {
    if( p[0].html_attributions[0] ) {
      var link = $( p[0].html_attributions[0] ).attr( "href" );
      return '<a target="_blank" href="' + link + '" target="gguserframe"><span class="glyphicon glyphicon-new-window"></span> ภาพบรรยากาศ</a>';
    }
  },
  lo_db_convert : function( a ) {
    return a.split(".").join("_");
  },
  db_insert_place : function( d ) {
    firebase.database().ref( d.id ).set({
      id : d.id,
      lat: d.lat,
      lng: d.lng,
      name : d.name,
      poohere : "0",
      review : []
    });
  },
  db_insert_comment : function( d ) {
    firebase.database().ref( d.id + '/review/' + moment().format('Y-m-d h:mm:ss') ).set({
      comment : d.comment,
      rating : d.rating,
      datetime : moment().format('MMMM Do YYYY, h:mm:ss a')
    }, function( e ) {
      alert( "เพิ่มความคิดเห็นของคุณแล้วนะ!" );
      gp.comment_load( db[d.id].review );
    });
  },
  db_update_poohere : function( d ) {
    firebase.database().ref( d.id ).update({
      poohere : ( parseInt( db[d.id].poohere ) + 1  )
    }, function( e ) {
      $( "#count_poohere" ).text( parseInt( db[d.id].poohere ) );
    });
  },
  comment_load : function( db ) {
    $( ".modal-body" ).html( function(){
      var r = '<div class="media" id="container_list_comment"  v-for="item in items">' +
                '<div class="media-left">' +
                  '<a href="#">{{ item.rating }}</a>' +
                '</div>' +
                '<div class="media-body">' +
                  '<h4 class="media-heading mt10">{{ item.comment }}</h4>' +
                  '<p>{{ item.datetime }}</p>' +
                '</div>' +
              '</div>';
      return r;
    });

    var container_list_comment = new Vue({
      el: '.modal-body',
      data: {
        items: db
      }
    });
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );


  $("#rateYo").rateYo({
    onChange: function (rating, rateYoInstance) {
      $( "#container_rateYo" ).attr( "data-rating", rating );
    },
    rating    : 5,
    fullStar: true,
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
