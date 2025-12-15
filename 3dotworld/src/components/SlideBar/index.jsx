import React, { useState } from 'react'
import CategoryCollapse from '../CategoryCollapse';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Collapse} from 'react-collapse';
import { FaChevronDown } from "react-icons/fa";

import "../SlideBar/style.css"
import { Button } from '@mui/material';

import RangeSlider from "react-range-slider-input";
import 'react-range-slider-input/dist/style.css';
import Rating from "@mui/material/Rating";





const SlideBar = () => {

    const[isOpenCategoryFilter, SetisOpenCategoryFilter] = useState(true);
    const[isOpenAvailability, SetisOpenAvailability] = useState(true);
    const[isOpenSizeFiltter, SetisOpenSizeFiltter] = useState(true);
    const[isOpenRatingFiltter, SetisOpenRatingFiltter] = useState(true);
    
    
    return(
        <aside className='sidebar py-3'>
            <div className='box'>
                <h3 className='mb-3 text-[18px] font-800 flex items-center'>Shop by Category
                    <Button onClick={() => SetisOpenCategoryFilter(!isOpenCategoryFilter)}>
                        <FaChevronDown />
                    </Button>

                </h3>
                <Collapse isOpened={isOpenCategoryFilter}>
                    <div className='scroll pr-1'>
                        <FormControlLabel control={<Checkbox  />} label="Fashion" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Electronics" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Bags" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Footwear" className='w-full'/>
                        <FormControlLabel control={<Checkbox  />} label="Groceries" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Beauty" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Wellness" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Jewwllery" className='w-full' />
                    </div>
                </Collapse>
                
            </div>

            <div className='box'>
                <h3 className=' mt-3 mb-3 text-[18px] font-800 flex items-center'>Availability
                    <Button onClick={() => SetisOpenAvailability(!isOpenAvailability)}>
                        <FaChevronDown />
                    </Button>

                </h3>
                <Collapse isOpened={isOpenAvailability}>
                    <div className='scroll pr-1'>
                        <FormControlLabel control={<Checkbox  />} label="Available (17)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="In Stock (19)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Not Available (3)" className='w-full' />
                    </div>
                </Collapse>
                
            </div>

            <div className='box'>
                <h3 className='mt-3 mb-3 text-[18px] font-800 flex items-center'>Size
                    <Button onClick={() => SetisOpenSizeFiltter(!isOpenSizeFiltter)}>
                        <FaChevronDown />
                    </Button>

                </h3>
                <Collapse isOpened={isOpenSizeFiltter}>
                    <div className='scroll pr-1'>
                        <FormControlLabel control={<Checkbox  />} label="Small (6)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Medium (5)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="Large (7)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="XL (2)" className='w-full' />
                        <FormControlLabel control={<Checkbox  />} label="XXL (5)" className='w-full' />
                    </div>
                </Collapse>
                
            </div>

            <div className='box mt-3'>
                <h3 className='mt-3 w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Filter By Price
                </h3>
                <RangeSlider />
                <div className='flex pt-4 pb-2 priceRange'>
                    <span className='text-[13px]'>
                        From:<strong className='text-dark'> Rs:{100}</strong>
                    </span>
                     <span className='ml-auto text-[13px]'>
                        From:<strong className='text-dark'> Rs:{5000}</strong>
                    </span>

                </div>

            </div>

            <div className='box mt-3'>
                <h3 className='mt-3 w-full mb-3 text-[16px] font-[600] flex items-center pr-5'>
                    Filter By Rating
                     <Button onClick={() => SetisOpenRatingFiltter(!isOpenRatingFiltter)}>
                        <FaChevronDown />
                    </Button>
                </h3>
                <Collapse isOpened={isOpenRatingFiltter}>
                   <div className='w-full'>
                     <Rating name="size-large" defaultValue={5} size="medium" readOnly />
                   </div>
                   <div className='w-full'>
                     <Rating name="size-large" defaultValue={4} size="medium" readOnly />
                   </div>
                   <div className='w-full'>
                    <Rating name="size-large" defaultValue={3} size="medium" readOnly />
                   </div>
                   <div className='w-full'>
                    <Rating name="size-large" defaultValue={2} size="medium" readOnly />
                   </div>
                   <div className='w-full'>
                    <Rating name="size-large" defaultValue={1} size="medium" readOnly />
                   </div>
                   
                </Collapse>
                
            </div>

        </aside>
    )
}

export default SlideBar;