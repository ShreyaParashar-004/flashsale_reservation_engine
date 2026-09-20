CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_stock INTEGER NOT NULL CHECK (total_stock >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id),
    user_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    idempotency_key VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    confirmed_at TIMESTAMP NULL,
    UNIQUE(idempotency_key)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    reservation_id UUID NOT NULL UNIQUE REFERENCES reservations(id),
    product_id UUID NOT NULL REFERENCES products(id),
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);