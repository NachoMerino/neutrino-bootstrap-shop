//  import core files
import $ from 'jquery';
import 'bootstrap/js/src';
import './styles.scss';
import navbarTemplate from './templates/navbar.html';
import modalTemplate from './templates/modal.html';
import mkCarousel from './carousel';
import refreshProducts from './products';

//  this is the function which is used when the page loads
$(() => {
  // for convenience we create a jQuery object in which
  //  we will be able to put the content of our pages
  const $pageContent = $('<div class="page-content"></div>');

  $('#root')
    // we keep that outside of the page content
    // because when we click on product details
    // we replace its content
    // (rather than creating the whole modal again)
    .append(modalTemplate)
    // the navbar stays accross the pages so
    // we keep it outside of the page content too
    .append(navbarTemplate)
    // we add the $pageContent here and
    // we will modify its own content later
    .append($pageContent);

  // in order to handle errors in consistent manner
  function handleAJAXError(xhr, status, error) {
    $pageContent
      .empty()
      .append(`<div>Ajax Error categories: ${error}</div>`);
  }

  // the #cart element is located in the navbar
  $('#cart').click(((e) => {
    e.preventDefault();
    $('.shopping-cart').toggle('slow', (() => {
    }));
  }));

  // we will trick the $pageContent to add a padding top
  // equivalent to the navbar outer height
  // (don't forget to remove styles which were supposed to do that in your SCSS)
  $pageContent.css('padding-top', $('.navbar').outerHeight());

  // read categories
  $.ajax('http://localhost:9090/api/categories')
    .done((categories) => {
      //  populate carousel with categories
      const $carousel = mkCarousel(categories);
      // we put the page element (carousel inside the $pageContent)
      $pageContent.append($carousel);
      $carousel.carousel();

      //  Iterate over the categories and append to navbar
      categories.forEach((category, number) => {
        $('.navbar-nav').append(`
            <li class="nav-item">
            <a class="nav-link" data-id="${number}" data-name="${category.name}" href="#">${category.name}</a>
            </li>`);
      });
    })
    //  or fail trying
    .fail(handleAJAXError);

  // ajax req and append products grid
  $.ajax('http://localhost:9090/api/products')
    .done((products) => {
      // append products-grid inside the $pageContent
      $pageContent
        .append(`<div class="infobox"><h2 id="infos">All products (${Object.keys(products).length})</h2></div>`)
        .append('<div id="products-grid" class="container-fluid"></div>');

      //  populate products-grid with products
      $('#products-grid').append('<div class="row"></div>');
      refreshProducts(products, '-1');

      // click event handler on nav-links
      $('.nav-link').click((eventObj) => {
        eventObj.preventDefault();
        const { target } = eventObj;
        const linkName = target.getAttribute('data-id');
        $('.navbar-nav .active').removeClass('active');
        $(target).closest('li').addClass('active');
        //  clean the products-grid and update the content
        refreshProducts(products, linkName);
      });
    })
    //  or fail trying
    .fail(handleAJAXError);
  // randomly select one user from the database at the beginning,
  // so that we have one user for ordering and checkout
  $.ajax('http://localhost:9090/api/customers')
    .done((customers) => {
      const user = JSON.stringify(customers[Math.floor(Math.random(customers.length))]);
      localStorage.setItem('user', user);
    });
  // End
});
