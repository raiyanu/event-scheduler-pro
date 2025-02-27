# Event Scheduler Pro

Event Scheduler Pro is a powerful and easy-to-use application for scheduling and managing events. It allows users to create, edit, and delete events, set reminders, and view events in a calendar format.

## Features

- Create, edit, and delete events
- View events in a calendar format
- User-friendly interface
- Dark/White theme
- All device screen friendly

## Tech-in-use

- Firebase@11
- React.js@18
- Next.Js@14
- React-Redux@9.0
- MUI@6 @mui/x-date-pickers@7.0
- react-big-calendar@1.0
- emoji-picker-react@4.0
- formik@2.0
- Sass@1.0
- yup@1.0
- react-responsive-masonry@2.7

## Installation

To install the application, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/raiyanu/event-scheduler-pro.git
   ```

2. Navigate to the project directory:

   ```sh
   cd event-scheduler-pro
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

## Usage

To start the application, run the following command:

```sh
npm start
```

Open your browser and navigate to `http://localhost:3000` to use the application.

## TODO

- [x] The first name should be a compulsory field. (Because of this I couldn't able to see the HI text in the home page)
- [x] Remove the button on add task modal
- [x] While clicking cancel the form should resetted to default state
- [X] While clicking delete, one extra modal is being appeared out of nowhere
- [X] Text content missing, for status
- [X] While clicking the logo, the entire application seems to be rendering again..
- [x] Phone number should not accept the alphabet / the validation is missing
- [X] The spelling for your task needs to be changed when there is no task added in the background
- [x] There is a border radius is missing on the add task modal.. In the dark mode the modal is rounded and in the white mode it's not
- [x] While initially loading, I can see the please login button there is a glimpse of it need to fix this
- [x] Fix the date, after typing it shows as Invalid Date in the view modal
- [x] While changing the time it's not getting reflected on the UI
- [x] Calendar date focus is of different color
- [x] Ask the basic information from the singup/registration like phone number and all
- [x] Maintain consistency throghout the application, use same wordings

## Contributing

We welcome contributions to Event Scheduler Pro! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```sh
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:

   ```sh
   git commit -m "Add your feature"
   ```

4. Push to the branch:

   ```sh
   git push origin feature/your-feature-name
   ```

5. Create a pull request.

## License

This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. To view a copy of this license, visit [http://creativecommons.org/licenses/by-nc/4.0/](http://creativecommons.org/licenses/by-nc/4.0/).

> An idiot admires complexity while genius admires simplicity
