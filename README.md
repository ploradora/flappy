The process 

1 after Brief
  a couple of things  - localStorage
                      - next app router ()
                      - gsap
                      - deploy it on Vercel
                      - some notes on the 
                      - timeframe 

2 - started building the 4 pages, the 3 that we navigate to and the redirect in case someone tries to acces one that Doesn’t exist.
  - components folder where i started creating a folder for each page. 
  - ui component where potentially the shared components would go into.
  - utils folder where I added bookmarkStorage functionality into an object creating CRUD functions. 

3 In the OverviewContent component added the form, the list of bookmars, pagination, and the toast which would appear when successfully saving the link to the list.
 #### why ref instead of conditional? - I Could’ve done by adding a conditinoal but I wanted to use gsap Doesn't cause a component re-render and easy to add complex show/hide logic.

    ----Form - wanted to be multifunctional. Added a 3 inputs initially, but I removed the description. I got carried away a bit. Logic to check and sanitize user input. 
            Required validation for link prefix. In the same form I wanted to add the update button as well. By using the same input you'd cal a different function when the edit button gets triggered. 
            
    ----BookmarkItem
    ----BookmarkList
    ----Pagination
    ----Layout
    ----animations file

    Pages not-found and [...catchAll]
     -not-found Runs in the browser after the component mounts, Provides visual feedback during redirection, [...c] Happens immediately during server-side rendering, Simpler, more -direct approach

    error.ts
     -Display an error message if something goes wrong
     -Automatically redirect to the overview page after 3 seconds
     -Provide buttons to try again or go to the homepage immediately
     -Show a subtle loading animation

    actions.server


    
1 After reading the brief I knew that i need a couple of things. LocalStorage since we don't have backend. app router for better performance and it's flexibility and it's habit, that's the way I set up the Environment . Gsap for transitions and animations (although there;s not a lot of animations in there) and I had to deliver it in four hours


What could you improve? 
--Refactoring the code by making it more granular. The bookmarkForm has over 400 lines of code which is a no.
--Delete svg's and use icons. Import them
--Separation of concern
--Context for the Overview component 
