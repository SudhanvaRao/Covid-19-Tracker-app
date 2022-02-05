import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import Table from "./Table";
import InfoBox from "./InfoBox";

function App() {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = data.sort((a, b) => {
            return b.cases - a.cases;
          });
          setCountries(countries);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app container-fluid mt-5">
      <div className="row">
        <div className="app-left col-lg-9">
          <div className="row">
            <div className="d-flex justify-content-between">
              <div className="col">
                <h1>Covid-19 Tracker</h1>
              </div>
              <div className="col d-flex justify-content-end">
                <FormControl>
                  <Select
                    variant="outlined"
                    value={country}
                    onChange={onCountryChange}
                  >
                    <MenuItem value="worldwide">Worldwide</MenuItem>
                    {countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <InfoBox
                title="Coronavirus Cases"
                cases={countryInfo.todayCases}
                total={countryInfo.cases}
              />
            </div>
            <div className="col-md-4">
              <InfoBox
                title="Recovered"
                cases={countryInfo.todayRecovered}
                total={countryInfo.recovered}
              />
            </div>
            <div className="col-md-4">
              <InfoBox
                title="Deaths"
                cases={countryInfo.todayDeaths}
                total={countryInfo.deaths}
              />
            </div>
          </div>
        </div>
        <div className="app-right col-lg-3">
          <Card>
            <CardContent>
              <div>
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
                <h3>Worldwide new cases</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
