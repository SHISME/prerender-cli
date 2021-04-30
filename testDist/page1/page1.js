/** @format */

const element = document.getElementById('test');
console.log('window.isPreRender:', window.isPreRender);
if (window.isPreRender) {
  element.style.background = '#bababa';
  element.style.color = 'transparent';
  document.querySelector('h1').style.color = 'transparent';
  document.querySelector('h1').style.background = '#bababa';
  document.querySelector('h4').style.color = 'transparent';
  document.querySelector('h4').style.background = '#bababa';
}
