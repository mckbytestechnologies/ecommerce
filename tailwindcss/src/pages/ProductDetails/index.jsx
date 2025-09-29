import React from 'react'
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductZoom from '../../components/ProductZoom';


const ProductDetails = () => {
    return(
        <section className="py-6 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
            <div className="container mx-auto px-4 max-w-7xl">
                <div role="presentation" className="mb-4">
                <Breadcrumbs aria-label="breadcrumb" className="text-sm">
                    <Link underline="hover" color="inherit" href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Home
                    </Link>
                    <span className="text-gray-900 font-medium">Deatils</span>
                </Breadcrumbs>
                </div>
            </div>

            <div className='containers flex gap-4'>
                <div className='productzoomcontainer'>
                    <ProductZoom/>

                </div>
                 
            </div>
        </section>
    )
}

export default ProductDetails