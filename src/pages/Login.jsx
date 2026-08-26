import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../Component/BaseComponent/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 12000); 

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    let mouse = { x: null, y: null };

    const handleMouseMoveWindow = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeaveWindow = () => {
        mouse.x = null;
        mouse.y = null;
    }
    
    window.addEventListener('mousemove', handleMouseMoveWindow);
    window.addEventListener('mouseout', handleMouseLeaveWindow);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.25 - distance/480})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        if (mouse.x != null && mouse.y != null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 - distance/450})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            
            // magnetic focus pull
            particles[i].x -= dx * 0.015;
            particles[i].y -= dy * 0.015;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveWindow);
      window.removeEventListener('mouseout', handleMouseLeaveWindow);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setMousePos({ x, y });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/signin",
        formData
      );
      setSuccess("Login successful!");
      localStorage.setItem("token", response.data.jwtToken);
      localStorage.setItem("companyId", response.data.companyId);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem(
        "moduleAccess",
        JSON.stringify(response.data.moduleAccess)
      );
      setTimeout(async () => {
        try {
          const moduleResponse = await axiosInstance.get("/module/getAllModule");
          const modules = moduleResponse.data || [];
          let sortedModules = [...modules].sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));

          const role = response.data.role;
          const moduleAccess = response.data.moduleAccess || [];

          if (role === "ROLE_EMPLOYEE") {
            sortedModules = sortedModules.filter((module) => {
              const access = moduleAccess.find(
                (item) => String(item.moduleId) === String(module.id)
              );
              return access?.canView === true;
            });
          }

          let canSeeEmployee = false;
          if (role === "ROLE_ADMIN") {
            canSeeEmployee = true;
          } else {
            const empAccess = moduleAccess.find((item) => item.moduleId === "EMPLOYEE_MANAGEMENT");
            if (empAccess?.canView === true) {
              canSeeEmployee = true;
            }
          }

          if (role === "ROLE_EMPLOYEE" && canSeeEmployee) {
            navigate("/employee");
          } else if (sortedModules.length > 0) {
            const firstModule = sortedModules[0];
            const targetPath = `/${firstModule.moduleKey || firstModule.name}/${firstModule.id}`;
            navigate(targetPath);
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching modules after login:", error);
          navigate("/dashboard");
        } finally {
            setIsLoading(false);
        }
      }, 800);
    } catch (err) {
      setError(err.response?.data || "An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-3d-wrapper" 
      onMouseMove={handleMouseMove}
      style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      
      {/* Dynamic background shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      
      {/* 3D decorative cubes */}
      <div className="cube cube-1">
        <div className="cube-container">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
      
      <div className="cube cube-2">
        <div className="cube-container">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      <div className="login-card-3d">
        <div className="text-center" style={{ textAlign: "center", marginBottom: "30px", transform: "translateZ(50px)" }}>
          <h2 style={{ margin: "0", fontSize: "32px", fontWeight: "800", background: "-webkit-linear-gradient(#fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PortalFlow CRM
          </h2>
          <p style={{ marginTop: "10px", color: "#bbb", fontSize: "14px" }}>
            Secure Portal Access
          </p>
        </div>

        {error && (
          <div className="alert-3d error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert-3d success">
            <span>✓</span> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ transformStyle: "preserve-3d" }}>
          <div className="form-group-3d">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="input-3d"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group-3d">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-3d"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={`btn-3d ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loader-spinner"></div>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="register-link-3d">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
