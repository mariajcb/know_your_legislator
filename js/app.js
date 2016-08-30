(function() {
        'use strict';
        $('.slider').slider({
            full_width: true
        });

        let legislators = [];

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
                                    $.get(`https://congress.api.sunlightfoundation.com/legislators/locate?latitude=${lat}&longitude=${lng}&apikey=7820472d4ec14d6eb316f1c4a0920ae4`)
                                        .then(function(legData) {
                                                if (legData.Error) {
                                                    console.log(legData.Error);
                                                } else {
                                                    let persons = legData.results;
                                                    for (var i = 0; i < persons.length; i++) {
                                                        let person = persons[i];
                                                        let first_name = person.first_name;
                                                        let last_name = person.last_name;
                                                        let state = person.state;
                                                        legislators.push({
                                                                'name': `${first_name} ${last_name}`,
                                                                'id': person.id,
                                                                'photo': person.photo_url,
                                                                'chamber': person.chamber,
                                                                'contact': person.contact_form,
                                                                'phone': person.phone,
                                                                'term': `${person.term_start} - ${person.term_end}`,
                                                            })
                                                            console.log(legislators);
                                                        }
                                                }
                                            })
                                        }
                            })
                        }
            })
        }
)();
