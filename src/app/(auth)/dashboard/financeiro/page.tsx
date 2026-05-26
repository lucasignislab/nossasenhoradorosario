'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/status-badge/status-badge';

export default function FinanceiroPage() {
  const user = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Exemplo de dados (em produção, viriam do Supabase)
  const membershipData = {
    status: 'pago' as const,
    currentMonth: '03/2026',
    amount: 'R$ 50,00',
    dueDate: '10/04/2026',
  };

  const paymentHistory = [
    { month: 'Fevereiro 2026', date: '10/02/2026', amount: 'R$ 50,00', status: 'pago' as const },
    { month: 'Janeiro 2026', date: '10/01/2026', amount: 'R$ 50,00', status: 'pago' as const },
    { month: 'Dezembro 2025', date: '10/12/2025', amount: 'R$ 50,00', status: 'pago' as const },
  ];

  const pixKey = '00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx5204000053039865802BR5913TERREIRO6009Sao Paulo62410503***63045BB8';

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '30px', color: '#2c1810' }}>💳 Gestão Financeira</h1>

        {/* Status Atual */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f9f7f3 0%, #f5f3f0 100%)',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#7d5a3d', fontWeight: 600 }}>
                Status da Mensalidade
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#2c1810',
                }}
              >
                {membershipData.amount}
              </p>
              <p
                style={{
                  margin: '8px 0 0 0',
                  color: '#7d5a3d',
                  fontSize: '14px',
                }}
              >
                Próximo vencimento: {membershipData.dueDate}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <StatusBadge status={membershipData.status} size="large" />
              <button
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #2dd936 0%, #1da52a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 217, 54, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✓ Em Dia
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Pagamento */}
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid #d4a574',
            marginBottom: '30px',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2c1810' }}>💰 Formas de Pagamento</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <button
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💳 Pagar com PIX
            </button>

            <button
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #4285f4 0%, #3567dc 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💳 Pagar com Stripe
            </button>
          </div>

          {/* PIX QR Code simulado */}
          <div
            style={{
              background: '#f9f7f3',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 12px 0', color: '#7d5a3d', fontWeight: 600 }}>
              Copiar chave PIX:
            </p>
            <code
              style={{
                display: 'block',
                background: 'white',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
                wordBreak: 'break-all',
                color: '#2c1810',
                marginBottom: '12px',
              }}
            >
              {pixKey}
            </code>
            <button
              style={{
                padding: '8px 16px',
                background: '#d4a574',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'background 0.3s ease',
              }}
              onClick={() => navigator.clipboard.writeText(pixKey)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#c9945f';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#d4a574';
              }}
            >
              📋 Copiar Chave
            </button>
          </div>
        </div>

        {/* Histórico de Pagamentos */}
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 165, 116, 0.2)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2c1810' }}>📋 Histórico de Pagamentos</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d4a574' }}>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: 600,
                      color: '#2c1810',
                    }}
                  >
                    Mês
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontWeight: 600,
                      color: '#2c1810',
                    }}
                  >
                    Data
                  </th>
                  <th
                    style={{
                      textAlign: 'right',
                      padding: '12px',
                      fontWeight: 600,
                      color: '#2c1810',
                    }}
                  >
                    Valor
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '12px',
                      fontWeight: 600,
                      color: '#2c1810',
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr
                    key={payment.month}
                    style={{
                      borderBottom: '1px solid rgba(212, 165, 116, 0.2)',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#2c1810' }}>
                      {payment.month}
                    </td>
                    <td style={{ padding: '12px', color: '#7d5a3d' }}>
                      {payment.date}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: 600,
                        color: '#2c1810',
                      }}
                    >
                      {payment.amount}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <StatusBadge status={payment.status} size="small" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
