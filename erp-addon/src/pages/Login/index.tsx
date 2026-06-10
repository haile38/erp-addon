import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, message } from "antd";

import { login } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import "./login.scss";

const LoginPage = () => {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(email, password);

      if (data.return) {
        saveAuth(data.token, data.refreshToken);
        message.success(data.message ?? "Đăng nhập thành công");
        navigate("/tasks");
      } else {
        message.error(data.message ?? "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      console.error(err);
      message.error("Tên đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card">
        {/* Left panel */}
        <div className="lp-left">
          <div className="lp-logo">
            <div className="lp-logo-mark">
              <Image
                alt="svg image"
                width={200}
                src="src/assets/image/enrich_co_inc_logo.jpg"
              />
            </div>
            <span className="lp-logo-text">ENRICH CO ERP</span>
          </div>

          <div className="lp-hero">
            <h1 className="lp-heading">
              Quản lý<br />
              <em>daily task</em><br />
              mỗi ngày.
            </h1>
            <p className="lp-sub">
              Theo dõi công việc của bạn<br />
              một cách đơn giản và hiệu quả.
            </p>
          </div>

          <p className="lp-copyright">© 2026 ENRICH CO ERP</p>
        </div>

        {/* Right panel */}
        <div className="lp-right">
          <h2 className="lp-title">Đăng nhập</h2>
          <p className="lp-desc">Nhập thông tin để tiếp tục</p>

          <form onSubmit={handleSubmit}>
            <div className="lp-field">
              <label className="lp-label" htmlFor="email">Tên đăng nhập</label>
              <input
                id="email"
                className="lp-input"
                type="text"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="password">Mật khẩu</label>
              <div className="lp-pw-wrap">
                <input
                  id="password"
                  className="lp-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button className="lp-btn" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="lp-footer">Gặp sự cố? Liên hệ quản trị viên</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;