module.exports = {
  checkWaivers: function(req, res, next) {
    var cart = req.session.cart;
    if(!cart){ return next(); }

    if (cart.some(function(i){ return i.product.requiresWaiver; })){
      cart.warnings = cart.warnings || [];
      cart.warnings.push('Some of the tours requested require a waiver.');
    }
    next();
  },

  checkGuestCounts: function(req, res, next) {
    var cart = req.session.cart;
    if(!cart){ return next(); }

    if(cart.some(function(item) { return item.gusts >itme.product.maximumGuests; })){
      cart.errors = cart.errors || [];
      cart.errors.push('One of the tours selected cannot accomodate the number of guests selected.');
    }
    next();
  }
}
