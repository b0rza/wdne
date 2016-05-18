suite('"About" page tests', function() {
  test('page shuld contain a link to contact page', function() {
    assert($('a[href="/contact"]').length);
  })
})
