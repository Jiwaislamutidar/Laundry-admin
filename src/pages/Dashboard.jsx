import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (!user) {
      navigate('/');
    } else {
      setAdminName(user);
      fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        // Sesuaikan dengan nama kolom di database
        body: JSON.stringify({ status_pesanan: newStatus }) 
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  // Hitung statistik menggunakan nama kolom database yang benar
  const totalPesanan = orders.length;
  const antrean = orders.filter(o => o.status_pesanan === 'pending').length;
  const diproses = orders.filter(o => o.status_pesanan === 'diproses').length;
  const totalPendapatan = orders
    .filter(o => o.status_pesanan === 'selesai')
    .reduce((sum, o) => sum + parseInt(o.total_harga || 0), 0);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>HydroWash</h2>
        </div>
        <nav className="sidebar-menu">
          <a href="#dashboard" className="active">Dashboard</a>
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit', cursor: 'pointer' }}>
            Keluar
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Selamat Datang, {adminName}</h1>
          <p>Berikut adalah ringkasan aktivitas HydroWash hari ini.</p>
        </header>

        <section className="stats-grid">
          <div className="card-stat">
            <h3>TOTAL PENDAPATAN</h3>
            <p className="stat-value">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
          </div>
          <div className="card-stat alert">
            <h3>PESANAN ANTREAN</h3>
            <p className="stat-value">{antrean}</p>
          </div>
          <div className="card-stat progress">
            <h3>SEDANG DIPROSES</h3>
            <p className="stat-value">{diproses}</p>
          </div>
          <div className="card-stat">
            <h3>TOTAL PESANAN</h3>
            <p className="stat-value">{totalPesanan}</p>
          </div>
        </section>

        <section className="table-section">
          <h2>Daftar Pesanan Laundry</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama & Kontak</th>
                  <th>Layanan</th>
                  <th>Berat</th>
                  <th>Total Harga</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="uppercase">#HW-{order.id}</td>
                    <td>
                      <strong>{order.nama}</strong><br/>
                      <small>{order.whatsapp}</small>
                    </td>
                    <td className="capitalize">{order.layanan}</td>
                    <td>{order.berat_kg} kg</td>
                    <td>Rp {parseInt(order.total_harga).toLocaleString('id-ID')}</td>
                    <td className="uppercase">{order.metode_pembayaran}</td>
                    <td>
                      <span className={`badge badge-${order.status_pesanan}`}>
                        {order.status_pesanan}
                      </span>
                    </td>
                    <td>
                      <select
                        className="select-action"
                        value={order.status_pesanan}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="dijemput">Dijemput</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;