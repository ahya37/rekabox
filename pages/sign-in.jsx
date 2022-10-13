import { SignInForm } from "../components";

export default function SignIn() {
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
                      Sign In  <strong>RekaBox</strong>
                    </h3>
                  </div>
                  <SignInForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
