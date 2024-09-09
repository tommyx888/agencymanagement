(function() {
    const supabaseUrl = 'https://rgeftrtsrzhnpvqlvqvk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZWZ0cnRzcnpobnB2cWx2cXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MTM5NzksImV4cCI6MjA0MTM4OTk3OX0.WdjDKAKnfdBmLP08tPAkQCepv4Hy1RcDYcUwnELG-XU';

    // Use the global supabase object provided by the Supabase library
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
})();