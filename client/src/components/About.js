import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';

const About = () => {
    return(
        <div>
            <Breadcrumb>
                <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                <BreadcrumbItem active>About us</BreadcrumbItem>
            </Breadcrumb>
            this is about us page. 
        </div>
    );
}

export default About;