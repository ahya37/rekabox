import Cookie from "js-cookie";
import { Fragment, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getBranchById } from "../../../services/branch";

export default function SelectBranch(props) {
  const {branch, data} = props;
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const branchId = Cookie.get('branch');

  const onSwitchBranch = async (value) => {
    if(branchId !== value){
        const token = Cookie.get('token');
        const data = new FormData();
        data.append('br_idx', value);
        data.append('token', token);    
        setIsLoading(true);
        const response = await getBranchById(data, token);
        localStorage.setItem("branch", JSON.stringify(response.data.data.branch));
        Cookie.set("branch", response.data.data.branch.br_idx);
        setIsLoading(false);
        window.location.reload();
    }

  }


  return (
    <Fragment>
      <Button variant="default" onClick={handleShow}>
        <b className="text-white">{branch.br_name}</b>
      </Button>
      <i className="fa fa-sort text-white float-right mt-2"></i>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Pilih Cabang</Modal.Title>
          <Button variant="default" onClick={handleClose}>
            <i className="fa fa-close"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          {data.map((list) => (
            <div className="list-group" key={list.br_idx} onClick={() => onSwitchBranch(list.br_idx)}>
              {list.br_mode === 'Basic' ? (
                 <a
                 href="#"
                 className="list-group-item list-group-item-action flex-column align-items-start border-0"
               >
                 <div className="d-flex w-100 justify-content-between">
                   <h5 className="mb-1">{list.br_name}
                     <span className="badge border border-primary text-primary ml-2">{list.br_mode}</span></h5>
                     {list.br_idx === branchId ? (<i className="fa fa-check mr-2 text-primary"></i>) : ("")}
                 </div>
                 <strong className="text-secondary">
                   Staf: {list.count.user} / Item: {list.count.item}
                 </strong>
               </a>
              ) : (
                <a
                  href="#"
                  className="list-group-item list-group-item-action flex-column align-items-start border-0"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{list.br_name}
                    <span className="badge border border-danger text-danger ml-2">
                      {list.br_mode}
                      </span>
                    </h5>
                     {list.br_idx === branchId ? (<i className="fa fa-check mr-2 text-primary"></i>) : ("")}
                  </div>
                  <strong className="text-secondary">
                    Staf: {list.count.user} / Item: {list.count.item} / Lokasi: {list.count.location}
                  </strong>
                </a>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <a href="/team/branch/new" className="text-primary">
            <i className="fa fa-plus"></i> Cabang Baru
          </a>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
