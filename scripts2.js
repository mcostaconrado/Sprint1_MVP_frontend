const countriesDropDown = document.getElementById("montadorasDropDown");

const countriesData = {
    "Australia": "🇦🇺",
    "Canada": "🇨🇦",
    "UK": "🇬🇧",
    "USA": "🇺🇸"
  }
  
for (let key in countriesData) {
    let option = document.createElement("option");
    option.setAttribute('value', data[key]);
  
    let optionText = document.createTextNode(key);
    option.appendChild(optionText);
  
    countriesDropDown.appendChild(option);
}

const flagIcon = document.getElementById("flag-icon");

countriesDropDown.addEventListener("change", e => {
    flagIcon.innerHTML = e.target.value;
 })