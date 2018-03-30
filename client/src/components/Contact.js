import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';

const Contact = () => {
    return(
        <div>
            <Breadcrumb>
                <BreadcrumbItem><a href="/home"><i class="fa fa-home fa-lg"></i></a></BreadcrumbItem>
                <BreadcrumbItem active>Contact us</BreadcrumbItem>
            </Breadcrumb>
            this is contact us page. 
        </div>
    );
}

export default Contact;