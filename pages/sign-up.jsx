import { SignUpForm } from "../components";

export default function SignUp() {
  return (
    <div className="container">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="form-block shadow">
                  <div className="mb-4">
                    <h3>
                      Sign Up to <strong>RekaBox</strong>
                    </h3>
                  </div>
                  <SignUpForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
