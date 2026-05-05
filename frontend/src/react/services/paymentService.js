import api from './api';

/**
 * Extrae los datos de una respuesta API estandarizada.
 * El backend retorna: { success: true, data: {...} }
 * @param {Object} response - Respuesta de axios
 * @returns {*} Los datos contenidos en response.data.data
 * @throws {Error} Si la estructura de respuesta es inválida
 */
function unwrap(response) {
  if (!response?.data) {
    console.error('[paymentService] Respuesta vacía del servidor');
    throw new Error('Respuesta vacía del servidor de pagos');
  }
  
  const apiResponse = response.data;
  
  // Validar estructura de ApiResponse
  if (typeof apiResponse.success !== 'boolean') {
    console.error('[paymentService] Estructura de respuesta inválida:', apiResponse);
    throw new Error('Respuesta del servidor con formato inválido');
  }
  
  if (!apiResponse.success) {
    console.error('[paymentService] Operación fallida en servidor');
    throw new Error(apiResponse.message || 'Operación fallida en el servidor');
  }
  
  const data = apiResponse.data;
  if (!data) {
    console.error('[paymentService] Datos vacíos en respuesta exitosa');
    throw new Error('No se recibieron datos de la sesión de pago');
  }
  
  return data;
}

/**
 * Crea una sesión de checkout de Stripe para una reservación.
 * @param {Object} payload - Datos de la solicitud
 * @param {string} payload.reservationId - UUID de la reservación
 * @param {string} payload.successUrl - URL de redirección tras pago exitoso
 * @param {string} payload.cancelUrl - URL de redirección tras cancelación
 * @param {string} [payload.idempotencyKey] - Clave de idempotencia opcional
 * @returns {Promise<{sessionId: string, checkoutUrl: string}>}
 */
export async function createCheckoutSession(payload) {
  // Validar payload antes de enviar
  if (!payload?.reservationId) {
    throw new Error('El ID de la reservación es requerido para el checkout');
  }
  
  if (!payload?.successUrl || !payload?.cancelUrl) {
    throw new Error('Las URLs de éxito y cancelación son requeridas');
  }

  console.log('[paymentService] Solicitando checkout session:', {
    reservationId: payload.reservationId,
    hasSuccessUrl: !!payload.successUrl,
    hasCancelUrl: !!payload.cancelUrl,
    hasIdempotencyKey: !!payload.idempotencyKey
  });

  try {
    const response = await api.post('/api/v1/payments/checkout-session', payload);
    const session = unwrap(response);
    
    // Validar que la sesión tenga los campos requeridos
    if (!session?.sessionId || !session?.checkoutUrl) {
      console.error('[paymentService] Sesión incompleta:', session);
      throw new Error('La sesión de pago no contiene la información completa');
    }
    
    console.log('[paymentService] Checkout session creada:', {
      sessionId: session.sessionId,
      hasCheckoutUrl: !!session.checkoutUrl
    });
    
    return session;
  } catch (error) {
    // Si ya es un error lanzado por unwrap, re-lanzar
    if (error.message && !error.response) {
      throw error;
    }
    
    // Manejar errores de axios
    const status = error?.response?.status;
    const data = error?.response?.data;
    
    console.error('[paymentService] Error en checkout:', {
      status,
      message: data?.message,
      error: data?.error
    });
    
    // Adjuntar información adicional al error para mejor debugging
    error.paymentContext = {
      reservationId: payload.reservationId,
      status: status,
      errorCode: data?.error,
      serverMessage: data?.message
    };
    
    throw error;
  }
}
