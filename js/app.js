(function() {
    'use strict';
    $('.slider').slider({
        full_width: true
    });

    $('form').submit(function() {
        event.preventDefault();
        let search = $('#search').val();
        if (search.length == 0) {
            Materialize.toast('Please enter a location!', 3000);
        } else {
            $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=AIzaSyA7mN9gSK-kj97TSn3oq9l0BrztFlPCG4Y`)
                .then(function(data) {
                    if (data.Error) {
                        console.log(data.Err);
                    } else {
                        let result = data.results[0].geometry.location;
                        let lat = result.lat;
                        let lng = result.lng;
                        $.get(`https://openstates.org/api/v1//legislators/geo/?lat=${lat}&long=${lng}&apikey=7820472d4ec14d6eb316f1c4a0920ae4`)
                            .then(function(legData) {
                                if (legData.Error) {
                                    console.log(legData.Error);
                                } else {
                                    for (var i = 0; i < legData.length; i++) {
                                        let person = legData[i];
                                        legislators.push({
                                            'name': person.full_name,
                                            'id': person.id,
                                            'state': person.state,
                                            'district': person.district,
                                            'party': person.party,
                                            'photo': person.photo_url,
                                            'chamber': person.chamber,
                                            'contact': person.offices,
                                        })
                                    }
                                    console.log(legislators);
                                }
                            })
                    }
                })
        }
    })
})();
