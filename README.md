# MMM-MyStudyLife
This is a module for [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). It displays info from the website [MyStudyLife](https://www.mystudylife.com/). It syncs and displays your class schedule plus upcoming exams and tasks. Each indivual class, exam, and task is colorcoded to the colors used in [MyStudyLife](https://www.mystudylife.com/).
![Screenshot of Module](https://github.com/ethanpartida/MMM-MyStudyLife/blob/master/Screenshot.PNG)

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/ethanpartida/MMM-MyStudyLife.git`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the node dependencies. 
3. Open a browser and navigate to the dashboard of your MyStudyLife account. Then open a developer console and input the command `localStorage._`. You should get a response along the lines of "XXXXXXXXXXXXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXX=". Paste this code in your config file as follows: 
<br>`code: "XXXXXXXXXXXXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXX="`. <br>
(Unfortunately My Study Life changes this code roughly once a month and this code will have to be manually updated by the user)

    ![Example of Dashboard and Console](https://github.com/ethanpartida/MMM-MyStudyLife/blob/master/Console.PNG)
4. Unfortunately there is no way to find which days of the week each class takes place using the data MyStudyLife exports so you must enter this info into the config file. You will create a javascript object which has the name of your classes as keys and an array of the dates the class occurs on as values. The arrays will contain integers which represent the dates. They are as follows:

    | Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
    |--------|--------|---------|-----------|----------|--------|----------|
    | 0      | 1      | 2       | 3         | 4        | 5      | 6        |

## Config
The MMM-MyStudyLife entry in `config.js` can include the following:

| Option           | Description                                                                                                                                       |
|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `interval`       | How often the data is updated (in milli-seconds),<br>**Type** `Integer`  <br>**Default** `100000`   |
| `code`           | The code received from MyStudyLife in step 3 <br>**Type** `String` <br>**Required**                                                                       |
| `color`          | Whether or not to color the module <br>**Type** `Boolean` <br>**Default** `true`                                                                          |
| `showSchedule`   | Whether or not to display a class schedule <br>**Type** `Boolean` <br>**Default** `true`                                                                  |
| `showExams`      | Whether or not to display upcoming exams <br>**Type** `Boolean` <br>**Default** `true`                                                                    |
| `showTasks`      | Whether or not to display upcoming tasks <br>**Type** `Boolean` <br>**Default** `true`                                                                    |
| `totNumOfTasks`  | The maximum amount of tasks displayed under the "Tasks" tab <br>**Type** `Integer` <br>**Default** `5`                                                    |
| `totNumOfExams`  | The maximum amount of exams displayed under the "Exams" tab <br>**Type** `Integer` <br>**Default** `7`                                                    |
| `includeExamSub` | Whether or not to include the subject of the exam before the title of the exam ("Physics Final" vs "Final") <br>**Type** `Boolean` <br>**Default** `true` |
| `classes`        | A javascript object containing all of your classes and what days of the week they take place on <br>**Type** `Object` <br>**Required**
| `militaryTime`   |  Whether or not to use 24 hour time in class schedule <br>**Type** `Boolean` <br>**Default** `true`  |

Here is an example of what `config.js` might look like:
```javascript
modules: [
  {
  module: "MMM-MyStudyLife",
  position: "top_right",
  config: {
    code: "XXXXXXXXXXXXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXX=",
    showSchedule: true,
    showExams: true,
    showTasks: true,
    classes: {
      "Intro to Algs. Lecture": [1,3,5],
      "Intro to Algs. Lab": [3],
      "Honors Math Lecture": [1,3,5],
      "Honors Math Discussion": [2,4],
      "Physics": [1],
      "General Review": [1],
      "Math": [1,3,5],
      "Physics 2 Lecture": [1,2,3,5],
      "Physics 2 Discussion": [4],
      "Physics 2 Lab": [4],
      "Digital Games and Society": [2,4],
      "CSE 1001": [5],
      "Honors Nexus": [4]
    }
  }
  },
]           
 ```
 ## Dependencies
 - [request](https://www.npmjs.com/package/request) (installed via `npm install`)
 
 ## Notes
 - This is my first project using Javascript, so feel free to submit any issues or critiques you have and I will do my best to update the project.
 - A special thanks to:
     1. [Michael Teeuw](https://github.com/MichMich) for creating [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop)     which made this project possible.
     2. [Sam Lewis](https://github.com/SamLewis0602) whose [MMM-Traffic](https://github.com/SamLewis0602/MMM-Traffic) module which I used a guide for much of this projects creation.
     3. [University of Minnesota Anderson Labs](https://cse.umn.edu/andersonlabs) which allowed me create the physcial mirror which this software was written for. The Taylor Student Project Fund and Anderson Labs were vital in the creation of this project.
