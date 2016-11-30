//load ISO country codes
var countries;
d3.csv("countries.csv", function(countries) {
  var ISO_Code = {};
  countries.forEach(function(d) {
    ISO_Code[d.location_name] = d["location"];
  });
  generateCountryList(ISO_Code);
});

//create dropdown of countries
var countrySel = d3.select("#countrySelector");

function generateCountryList(countries) {
  for (var country in countries) {
    var option=countrySel.append("option");
      option.text(country)
      .attr("value", countries[country]);

    //set starting country
    if (country=="United States") option.attr("selected",true);

  }
  loadCountry("USA");
}

