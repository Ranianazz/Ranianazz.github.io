// function add(val1, val2) {
//   let total = val1 + val2;
//   console.log(total);
//   return total;
// }
// function subtract(val1, val2) {
//   let res = val1 - val2;
//   console.log(res);
//   return res;
// }
// function whatIsMyGrade(marks)
// {
//     if(marks > 80){
//         console.log("you got HD")
//         else if (marks< 40){
//             console.log("sorry you failed")
//         }
//     }
//     else {
//         console.log("you passed");
//     }
// }

// let c = add(10, 20);
// // let a = 20;
// // let b = 10;
// //let c = a + b

// c = 40 + 56;
// console.log(c);

// c = subtract(140, 56);

// let score = 59;
// let msg = whatIsMyGrade;

// a = 45;
// b = 6;
// c = a + b;
// console.log(c);
const header = document.querySelector("header");
const topHeading = document.querySelector("h1");
console.log(header);
console.log(header.textContent);
console.log(header.innerHTML);
let course = "OART1013";
header.innerHTML += `<h2> class="blue-color"> This is ${course} OART1013 </h2>`;
console.log(header.textContent);

// console.log(topHeading);
// console.log(topHeading.textContent);

const allParas = document.querySelectorAll("p");
console.log(allParas);
for (let i = 0; i < length; i++);
{
  console.log(allParas[i].textContent);
  allParas[i].style.border = "1px solid green";
  allParas[i].style.backgroundColor = "beige";
}

const firstSubheading = document.querySelector("#first-subheadong");
