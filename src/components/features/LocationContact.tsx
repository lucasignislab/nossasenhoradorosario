'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Compass, Map } from 'lucide-react';

export interface LocationContactProps {
  /** Endereço do terreiro */
  address: string;
  /** Coordenadas de latitude */
  latitude?: number;
  /** Coordenadas de longitude */
  longitude?: number;
  /** Telefone para contato */
  phone?: string;
  /** Email para contato */
  email?: string;
  /** Horário de funcionamento */
  hours?: string;
  /** Links do Google Maps e Waze */
  mapsUrl?: string;
  wazeUrl?: string;
  /** Callback ao enviar formulário */
  onFormSubmit?: (data: { name: string; email: string; message: string }) => void;
}

export const LocationContact = ({
  address,
  latitude = -23.5505,
  longitude = -46.6333,
  phone = '(11) 9999-9999',
  email = 'contato@terreiro.com.br',
  hours = 'Seg-Sex: 18h-22h | Sab-Dom: 14h-22h',
  mapsUrl,
  wazeUrl,
  onFormSubmit,
}: LocationContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const googleMapsUrl =
    mapsUrl ||
    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.5789!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTerreira!5e0!3m2!1spt-BR!2sbr!4v`;

  const wazeLink = wazeUrl || `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    setTimeout(() => {
      onFormSubmit?.(formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 500);
  };

  return (
    <section className="py-32 md:py-40 bg-[#FFFFFF] relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="block text-xs font-semibold tracking-[0.25em] uppercase text-[#6F6F6F] mb-4 font-inter">
            Fale Conosco & Visite
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-8 font-[var(--font-heading)] leading-[0.95] tracking-tight">
            Localização e Contato
          </h2>
          <div className="w-16 h-[1px] bg-black/15 mx-auto" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Coluna do Mapa e Info (7/12) */}
          <div className="w-full lg:w-7/12 flex flex-col gap-10">
            <div className="relative overflow-hidden rounded-md border border-black/5 shadow-lg aspect-[16/10] w-full">
              <iframe
                title="Localização do Terreiro"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
                src={googleMapsUrl}
              />
            </div>

            {/* Informações Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[var(--color-sacred-gold)]">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase mb-1 font-inter">Endereço</p>
                  <p className="text-sm text-black leading-relaxed font-sans">{address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[var(--color-sacred-gold)]">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase mb-1 font-inter">Telefone</p>
                  <a href={`tel:${phone}`} className="text-sm text-black hover:text-[var(--color-sacred-gold)] transition-colors leading-relaxed font-sans block">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[var(--color-sacred-gold)]">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase mb-1 font-inter">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-black hover:text-[var(--color-sacred-gold)] transition-colors leading-relaxed font-sans block break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[var(--color-sacred-gold)]">
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase mb-1 font-inter">Horário</p>
                  <p className="text-sm text-black leading-relaxed font-sans">{hours}</p>
                </div>
              </div>
            </div>

            {/* Botões de GPS */}
            <div className="flex gap-4 flex-wrap mt-4">
              <a 
                href={wazeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold bg-black text-white hover:scale-[1.03] transition-all duration-300 font-inter uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
              >
                <Compass size={14} className="mr-2" />
                Abrir no Waze
              </a>
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold border border-black/10 text-black hover:border-black/35 hover:scale-[1.03] transition-all duration-300 font-inter uppercase tracking-wider shadow-sm cursor-pointer"
              >
                <Map size={14} className="mr-2" />
                Abrir no Maps
              </a>
            </div>
          </div>

          {/* Coluna do Formulário (5/12) */}
          <div className="w-full lg:w-5/12">
            <form className="bg-[#FAF5EC]/50 border border-black/5 p-8 md:p-10 rounded-md shadow-lg flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-2xl font-normal text-black font-[var(--font-heading)] mb-2">
                  Entre em Contato
                </h3>
                <p className="text-xs text-[#6F6F6F] font-inter leading-relaxed">
                  Envie-nos uma mensagem e retornaremos em breve.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase font-inter">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-black/10 bg-white/50 rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all duration-300"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase font-inter">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-black/10 bg-white/50 rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all duration-300"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-semibold tracking-wider text-[#6F6F6F] uppercase font-inter">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full border border-black/10 bg-white/50 rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:border-[var(--color-sacred-gold)]/50 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>

              {submitSuccess && (
                <div className="text-xs font-semibold text-green-600 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-sm font-inter">
                  ✓ Mensagem enviada com sucesso! Obrigado.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full py-3.5 text-xs font-semibold bg-black text-white hover:scale-[1.03] transition-all duration-300 font-inter uppercase tracking-[0.15em] shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LocationContact;
