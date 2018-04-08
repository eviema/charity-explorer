import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'mdbreact';
import { ReactTypeformEmbed } from 'react-typeform-embed';

const Contact =  () => {

    return(
        <div>

            <Breadcrumb className="small mb-0">
                <BreadcrumbItem><a href="/home"><i className="fa fa-home"></i></a></BreadcrumbItem>
                <BreadcrumbItem active>Contact us</BreadcrumbItem>
            </Breadcrumb>

            {/* form wrapper */}
            <div style={{height:"80vh",}} >
                <ReactTypeformEmbed url={'https://yifei2.typeform.com/to/tkK1rq'} />
            </div>

        </div>
    );

}

export default Contact;