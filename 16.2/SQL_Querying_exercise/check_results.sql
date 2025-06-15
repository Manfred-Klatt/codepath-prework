-- Check final state of products table
SELECT * FROM products;

-- Check which products are returnable
SELECT name, price, can_be_returned 
FROM products 
WHERE can_be_returned = true;

-- Check price range of products
SELECT name, price 
FROM products 
ORDER BY price;
