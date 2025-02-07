import React, { useEffect, useState } from 'react';
 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoryId: number;
    gendersID: number;
    newSaleID: number;
    hotSaleID: boolean;
    size: string;
    color: string;
    price: number;
    image: string;
}

const RecommentProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('http://localhost:5000/products');
                const filteredProducts = response.data.filter(product => product.hotSaleID === false);
                setProducts(filteredProducts);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleProductClick = (id: string) => {
        navigate(`/productdetail/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <div className="header-low">
            CÓ THỂ BẠN QUAN TÂM
            </div>
            <div className="product-grid">
                {currentProducts && currentProducts.map((product) => (
                    <div 
                        className="product" 
                        key={product.id} 
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img alt={product.name} height="400" src={product.image} width="300" />
                        <div className="product-title">
                            {product.name}
                        </div>
                        <div className="product-price">
                        {product.price.toLocaleString('vi-VN')} VND
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button className='BTN-pagination'
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button className='BTN-pagination'
                    onClick={() => paginate(currentPage + 1)}
                    disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default RecommentProduct;
