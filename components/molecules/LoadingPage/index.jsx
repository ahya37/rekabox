import React from 'react'
import { Navbar,Sidebar } from '../../organisms'
import { Spinner} from "react-bootstrap";

export default function LoadingPage() {
  return (
    <div className="wrapper">
      <Sidebar activeMenu="item" />
      <div id="content-page" className="content-page">
      <Navbar />
      <div className="container-fluid">
        <div className="row">
         <div className="col-md-12 col-sm-12">
          <div className="iq-card w-100 p-3">
            <div className="iq-card-body d-flex justify-content-center">
                <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" className="text-center"/>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  )
}
