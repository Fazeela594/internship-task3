# Freelancing Marketplace Platform

Hunar ("skill" in Urdu) is a freelancing marketplace where clients can find freelancers for web, design, mobile, data and marketing work, and freelancers can manage their profile and services. Built as an internship project with HTML5, CSS3 and vanilla JavaScript.

- **Week 1:** landing page (homepage)
- **Week 2:** freelancer and service marketplace interface (browse, search, filter, sort, profile page)
- **Week 3:** user dashboard, profile editing, service creation and service details

## Features

### Week 1 – Landing page

- **Navigation bar:** brand logo, Home, Find Freelancers, Find Jobs, About, and Login/Register buttons. It stays fixed at the top, highlights the section you are viewing, and becomes a hamburger menu on mobile.
- **Hero section:** platform introduction, a tabbed search bar ("Search for services" / "Search freelancers"), quick-search tags, and animated platform stats.
- **Popular categories:** Web Development, Graphic Design, Mobile App Development, Data Analysis and Digital Marketing.
- **How it works:** three-step explanation of the platform.
- **Featured freelancers:** cards generated from a JavaScript data array, with live search, category chips, sorting and a save (heart) button.
- **Login/Register modal:** form validation, switch between login and register, closes with Esc or a click outside.
- **Footer:** links and copyright.

### Week 2 – Marketplace interface

**Find Freelancers page (`freelancers.html`)**

- **Freelancer/service cards:** each card shows a profile image, freelancer name, city, service title, category, starting price, rating, number of reviews, and a **View Profile** button. Cards are built by one reusable function.
- **Search:** live search by name, service, skill or category (for example "react" or "logo design").
- **Category filtering:** filter chips for all five categories.
- **Advanced filters:** maximum starting price slider and minimum rating.
- **Sorting:** Highest Rated, Price: Low to High, Price: High to Low, and Most Reviews.
- **Dynamic content handling:** result count that updates instantly, a loading skeleton, an empty state with a "Clear filters" button, and saved freelancers that are remembered in the browser.

**Freelancer Profile / Service Details page (`profile.html`)**

- Opens from the **View Profile** button using the freelancer's id in the link (for example `profile.html?id=3`).
- Profile header with image, name, service title, rating, city and category.
- **About** and **Reviews** tabs, with skills and sample reviews.
- **Basic, Standard and Premium packages:** the price, delivery time and included features change when a package is selected.
- **Multiple UI states:** loading skeleton, profile view, "not found" message, request sending, and request sent confirmation.
- **Save** button and a "You may also like" section with more freelancer cards.

### Week 3 – User dashboard and service creation

**Dashboard (`dashboard.html`)**

A dashboard-style layout with a sidebar (Profile, Edit Profile, My Services, Create Service). The sections open without reloading the page, and the browser back button works between them.

- **User / Freelancer Profile:** profile picture, name, professional title, about/bio, skills, experience, rating, starting price (taken from the cheapest service), and the freelancer's services.
- **Edit Profile:** form for picture, name, title, email, city, bio, skills and experience.
  - Profile picture upload with preview, change and remove.
  - Skills tag input (type and press Enter, remove with a click or Backspace).
  - Add and remove experience rows.
  - Bio character counter.
- **Create Service:** form for service image, title, category, description, price, delivery time and skills/tags.
  - Drag-and-drop or click-to-upload image area with preview.
  - Live preview card that updates while typing.
- **My Services:** shows all created services with **View**, **Edit** and **Delete** buttons. Delete asks for confirmation first.
- **Advanced form validation:** messages appear under each field on blur and on submit, character and number limits, a valid email check, image type and size check, a "fix highlighted fields" message, and focus moves to the first error.
- **Multiple UI states:** loading skeleton, empty "no services yet" state, "service not found" state, saving state on the submit button, and success messages.
- **Saved in the browser:** the profile and services are stored with localStorage, so they are still there after a refresh.

**Service Details page (`service.html`)**

- Opens from the **View** button using the service id in the link (for example `service.html?id=s1`).
- Shows the service image, title, category, description, tags, price, delivery time and the seller card.
- Buttons to edit the service or go back to My Services, plus loading and "not found" states.

**All weeks**

- **Responsive design:** desktop, tablet (up to 960px) and mobile (up to 700px). The dashboard sidebar turns into a scrollable tab bar on smaller screens.
- **Consistent design:** the same colours, fonts, buttons and navigation across all pages.
- **Accessibility:** keyboard focus styles, ARIA labels, and reduced-motion support.

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, CSS variables, media queries)
- JavaScript (DOM manipulation, event delegation, URL parameters, hash routing, localStorage, FileReader and Canvas for image upload, IntersectionObserver)

## Project structure

```
├── index.html         # Week 1: landing page
├── style.css          # Week 1: main design and responsive styles
├── main.js            # Week 1: landing page interactions
├── freelancers.html   # Week 2: Find Freelancers page
├── profile.html       # Week 2: freelancer profile page
├── market.css         # Week 2: styles for the marketplace and profile pages
├── market.js          # Week 2: search, filtering and sorting
├── profile.js         # Week 2: profile page, tabs, packages and order states
├── dashboard.html     # Week 3: dashboard page
├── dashboard.js       # Week 3: profile, edit profile, services, forms and validation
├── service.html       # Week 3: service details page
├── service.js         # Week 3: service details logic
├── dash.css           # Week 3: dashboard, form and upload styles
└── common.js          # Shared: sample data, reusable card, navigation, saved profile and services
```

## How to run

1. Download or clone the repository.
2. Keep all files in the same folder.
3. Open `index.html` in a browser (or use the VS Code Live Server extension).
4. Use **Find Freelancers** to browse, and **Dashboard** (or **My Account**) to manage your profile and services.

The data is stored in your own browser, so there is no backend yet. Clearing the browser data resets the profile and services to the sample ones.


```

## Author

Fazeela Manzoor ([@Fazeela594](https://github.com/Fazeela594))
