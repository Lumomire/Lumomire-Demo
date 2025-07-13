// DemoDataGenerator.js - Complete consolidated module for Lumomire demo
// This file contains all demo data generation logic in one place for easy deployment

// ========== Texas Specific Data ==========
const getTexasSpecificData = () => {
  return {
    counties: [
      { name: 'Harris County', city: 'Houston', population: 4731145 },
      { name: 'Dallas County', city: 'Dallas', population: 2613539 },
      { name: 'Tarrant County', city: 'Fort Worth', population: 2110640 },
      { name: 'Bexar County', city: 'San Antonio', population: 2009324 },
      { name: 'Travis County', city: 'Austin', population: 1290188 }
    ],
    courthouses: [
      'Harris County Civil Courthouse',
      'Harris County Criminal Justice Center',
      'Travis County Courthouse',
      'Dallas County Courthouse',
      'Bexar County Courthouse'
    ],
    judges: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
      'Garcia', 'Rodriguez', 'Martinez', 'Davis', 'Miller'
    ],
    barDistricts: [
      'District 1 - Houston',
      'District 4 - Austin',
      'District 5 - Dallas',
      'District 3 - San Antonio'
    ]
  };
};

// ========== Firm Profiles ==========
const firmTemplates = {
  solo: {
    name: () => {
      const lastNames = ['Johnson', 'Williams', 'Martinez', 'Garcia', 'Davis'];
      const name = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${name} Law Office`;
    },
    size: 1,
    practiceAreas: ['Family Law', 'Criminal Defense', 'Estate Planning'],
    billingRates: { min: 250, max: 350, increment: 0.1 },
    clients: 20,
    location: 'Houston'
  },
  medium: {
    name: () => {
      const firmNames = ['Harris County Legal Group', 'Austin Law Partners', 'Texas Legal Associates'];
      return firmNames[Math.floor(Math.random() * firmNames.length)];
    },
    size: 5,
    practiceAreas: ['Business Law', 'Real Estate', 'Employment', 'Litigation'],
    billingRates: { min: 350, max: 450, increment: 0.1 },
    clients: 75,
    location: 'Austin'
  },
  large: {
    name: () => {
      const firmNames = ['Texas Premier Law', 'Southwest Legal Partners LLP', 'Houston Corporate Counsel'];
      return firmNames[Math.floor(Math.random() * firmNames.length)];
    },
    size: 10,
    practiceAreas: ['Corporate M&A', 'Securities', 'Tax', 'Healthcare', 'Energy'],
    billingRates: { min: 450, max: 750, increment: 0.1 },
    clients: 150,
    location: 'Dallas'
  }
};

// ========== Main Generator Class ==========
class DemoDataGenerator {
  constructor() {
    this.firmType = null;
    this.firmData = null;
    this.attorneys = [];
    this.calendarEvents = [];
    this.emails = [];
    this.timeEntries = [];
    this.gaps = [];
    this.texasData = getTexasSpecificData();
  }

  generateForFirmType(firmType = 'medium') {
    this.reset();
    this.firmType = firmType;
    
    // Generate firm profile
    this.firmData = this.generateFirmProfile(firmType);
    
    // Generate attorneys
    this.attorneys = this.generateAttorneys();
    
    // Generate calendar events
    this.calendarEvents = this.generateCalendarEvents();
    
    // Generate correlated emails
    this.emails = this.generateEmailPatterns();
    
    // Generate existing time entries
    this.timeEntries = this.generateTimeEntries();
    
    // Analyze and find gaps
    this.gaps = this.analyzeGaps();
    
    return this.getFormattedData();
  }

  generateFirmProfile(firmType) {
    const template = firmTemplates[firmType] || firmTemplates.medium;
    
    return {
      id: `FIRM-${Date.now()}`,
      name: template.name(),
      type: firmType,
      size: template.size,
      practiceAreas: template.practiceAreas,
      billingRates: template.billingRates,
      location: {
        city: template.location,
        county: this.texasData.counties.find(c => c.city === template.location)?.name || 'Harris County',
        state: 'Texas'
      },
      matters: this.generateMatters(template)
    };
  }

  generateMatters(template) {
    const matters = [];
    const matterCount = Math.floor(template.clients * 1.5); // Average 1.5 matters per client
    
    for (let i = 0; i < matterCount; i++) {
      const practiceArea = template.practiceAreas[Math.floor(Math.random() * template.practiceAreas.length)];
      const clientNames = ['Johnson Corp', 'Smith Family Trust', 'ABC Services', 'Tech Solutions Inc', 'Main Street LLC'];
      const client = clientNames[Math.floor(Math.random() * clientNames.length)];
      
      matters.push({
        id: `${practiceArea.substring(0, 3).toUpperCase()}-2024-${String(i + 1).padStart(3, '0')}`,
        name: `${client} - ${practiceArea}`,
        client: client,
        practiceArea: practiceArea,
        status: 'active'
      });
    }
    
    return matters;
  }

  generateAttorneys() {
    const attorneys = [];
    const firstNames = ['James', 'Patricia', 'Michael', 'Jennifer', 'David', 'Linda', 'Robert', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Rodriguez'];
    
    for (let i = 0; i < this.firmData.size; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const yearsExperience = Math.floor(Math.random() * 20) + 5;
      
      const attorney = {
        id: `ATT-${String(i + 1).padStart(3, '0')}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${this.firmData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        barNumber: `24${String(Math.floor(Math.random() * 900000) + 100000)}`,
        yearsExperience: yearsExperience,
        role: i === 0 ? 'admin' : 'attorney',
        billingRate: Math.round((this.firmData.billingRates.min + 
          (this.firmData.billingRates.max - this.firmData.billingRates.min) * 
          (yearsExperience / 30)) / 25) * 25,
        assignedMatters: []
      };
      
      // Assign matters to attorney
      const matterCount = Math.floor(this.firmData.matters.length / this.firmData.size);
      for (let j = 0; j < matterCount; j++) {
        const matterIndex = i * matterCount + j;
        if (matterIndex < this.firmData.matters.length) {
          attorney.assignedMatters.push(this.firmData.matters[matterIndex]);
        }
      }
      
      attorneys.push(attorney);
    }
    
    return attorneys;
  }

  generateCalendarEvents() {
    const events = [];
    const today = new Date();
    const eventTypes = ['court', 'meeting', 'call', 'work'];
    
    this.attorneys.forEach(attorney => {
      // Generate events for last 30 days
      for (let d = 0; d < 30; d++) {
        const date = new Date(today.getTime() - d * 24 * 60 * 60 * 1000);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // 2-5 events per day
        const eventsPerDay = Math.floor(Math.random() * 4) + 2;
        
        for (let e = 0; e < eventsPerDay; e++) {
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          const matter = attorney.assignedMatters[Math.floor(Math.random() * attorney.assignedMatters.length)];
          
          const event = this.generateSingleEvent(attorney, matter, date, eventType);
          events.push(event);
        }
      }
    });
    
    return events.sort((a, b) => b.startTime - a.startTime);
  }

  generateSingleEvent(attorney, matter, date, type) {
    const templates = {
      court: {
        titles: ['Hearing', 'Motion', 'Status Conference'],
        durations: [60, 120, 240],
        locations: this.texasData.courthouses
      },
      meeting: {
        titles: ['Client Meeting', 'Strategy Session', 'Case Review'],
        durations: [30, 60, 90],
        locations: ['Office', 'Conference Room', 'Virtual']
      },
      call: {
        titles: ['Phone Call', 'Conference Call', 'Client Update'],
        durations: [15, 30, 45],
        locations: ['Office']
      },
      work: {
        titles: ['Document Review', 'Draft Contract', 'Research'],
        durations: [60, 120, 180],
        locations: ['Office']
      }
    };
    
    const template = templates[type];
    const title = template.titles[Math.floor(Math.random() * template.titles.length)];
    const duration = template.durations[Math.floor(Math.random() * template.durations.length)];
    const location = template.locations[Math.floor(Math.random() * template.locations.length)];
    
    const hour = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
    const startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0);
    
    return {
      id: `CAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attorneyId: attorney.id,
      attorneyName: attorney.name,
      title: matter ? `${title} - ${matter.client}` : title,
      type: type,
      startTime: startTime,
      duration: duration,
      location: location,
      matter: matter,
      needsTravel: type === 'court'
    };
  }

  generateEmailPatterns() {
    const emails = [];
    
    // Generate emails related to calendar events
    this.calendarEvents.forEach(event => {
      // Before event emails
      if (Math.random() > 0.3) {
        emails.push({
          id: `EMAIL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          subject: `Re: ${event.title} - Preparation`,
          from: 'client@example.com',
          to: this.attorneys.find(a => a.id === event.attorneyId).email,
          timestamp: new Date(event.startTime.getTime() - 24 * 60 * 60 * 1000), // 1 day before
          hasAttachment: Math.random() > 0.5,
          matter: event.matter,
          relatedEvent: event
        });
      }
      
      // After event emails
      if (Math.random() > 0.4) {
        emails.push({
          id: `EMAIL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          subject: `Follow-up from ${event.type}`,
          from: this.attorneys.find(a => a.id === event.attorneyId).email,
          to: 'client@example.com',
          timestamp: new Date(event.startTime.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
          hasAttachment: false,
          matter: event.matter,
          relatedEvent: event
        });
      }
    });
    
    return emails.sort((a, b) => b.timestamp - a.timestamp);
  }

  generateTimeEntries() {
    const entries = [];
    
    // Generate time entries for 75% of calendar events
    this.calendarEvents.forEach(event => {
      if (Math.random() < 0.75 && event.type !== 'internal') {
        const attorney = this.attorneys.find(a => a.id === event.attorneyId);
        
        const entry = {
          id: `TIME-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          attorneyId: attorney.id,
          date: event.startTime,
          duration: event.duration / 60, // Convert to hours
          description: `${event.type} - ${event.matter ? event.matter.name : 'General'}`,
          matter: event.matter,
          rate: attorney.billingRate,
          amount: (event.duration / 60) * attorney.billingRate,
          relatedEventId: event.id
        };
        
        entries.push(entry);
      }
    });
    
    return entries;
  }

  analyzeGaps() {
    const gaps = [];
    
    // Find calendar events without time entries
    this.calendarEvents.forEach(event => {
      const hasTimeEntry = this.timeEntries.some(entry => entry.relatedEventId === event.id);
      
      if (!hasTimeEntry && event.type !== 'internal') {
        const attorney = this.attorneys.find(a => a.id === event.attorneyId);
        const confidence = this.calculateConfidence(event);
        
        gaps.push({
          type: event.type,
          date: event.startTime,
          duration: event.duration / 60,
          confidence: confidence,
          context: event.title,
          calendarEvent: event.title,
          emailCount: this.emails.filter(e => e.relatedEvent && e.relatedEvent.id === event.id).length,
          matter: event.matter,
          attorney: attorney,
          hourlyRate: attorney.billingRate
        });
      }
    });
    
    // Add travel time gaps for court events
    this.calendarEvents
      .filter(event => event.needsTravel)
      .forEach(event => {
        const attorney = this.attorneys.find(a => a.id === event.attorneyId);
        
        gaps.push({
          type: 'travel',
          date: new Date(event.startTime.getTime() - 30 * 60 * 1000),
          duration: 0.5,
          confidence: 0.85,
          context: `Travel to ${event.location}`,
          calendarEvent: event.title,
          emailCount: 0,
          matter: event.matter,
          attorney: attorney,
          hourlyRate: attorney.billingRate
        });
      });
    
    return gaps.filter(gap => gap.confidence >= 0.5);
  }

  calculateConfidence(event) {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on event type
    const typeConfidence = {
      court: 0.95,
      meeting: 0.85,
      call: 0.75,
      work: 0.80
    };
    
    confidence = typeConfidence[event.type] || confidence;
    
    // Boost for longer events
    if (event.duration >= 60) confidence += 0.05;
    if (event.duration >= 120) confidence += 0.05;
    
    // Boost if has related emails
    const relatedEmails = this.emails.filter(e => e.relatedEvent && e.relatedEvent.id === event.id);
    if (relatedEmails.length > 0) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  formatMissingEntries() {
    return this.gaps.map((gap, index) => ({
      id: index + 1,
      date: gap.date.toISOString().split('T')[0],
      duration: gap.duration,
      confidence: gap.confidence,
      context: gap.context,
      calendarEvent: gap.calendarEvent,
      emailCount: gap.emailCount,
      suggestedMatter: gap.matter ? gap.matter.id : null,
      value: Math.round(gap.duration * gap.hourlyRate),
      status: 'pending',
      attorney: gap.attorney,
      type: gap.type
    }));
  }

  calculateStats() {
    const totalHours = this.gaps.reduce((sum, gap) => sum + gap.duration, 0);
    const totalRevenue = this.gaps.reduce((sum, gap) => sum + (gap.duration * gap.hourlyRate), 0);
    const avgConfidence = this.gaps.length > 0
      ? this.gaps.reduce((sum, gap) => sum + gap.confidence, 0) / this.gaps.length
      : 0;

    return {
      hoursFound: Math.round(totalHours * 10) / 10,
      revenueRecovered: Math.round(totalRevenue),
      confidenceAvg: Math.round(avgConfidence * 100),
      entriesProcessed: this.gaps.length,
      weeklyAverage: Math.round((totalHours / 4) * 10) / 10,
      monthlyProjection: Math.round(totalRevenue * 1.2)
    };
  }

  getFormattedData() {
    return {
      firm: this.firmData,
      attorneys: this.attorneys,
      missingTimeEntries: this.formatMissingEntries(),
      stats: this.calculateStats(),
      calendarEvents: this.calendarEvents,
      emails: this.emails,
      timeEntries: this.timeEntries
    };
  }

  getDemoScenarios() {
    return {
      highValue: this.gaps
        .filter(gap => gap.duration >= 2 && gap.confidence >= 0.85)
        .slice(0, 3),
      courtRelated: this.gaps
        .filter(gap => gap.type === 'court' || gap.context.toLowerCase().includes('court'))
        .slice(0, 3),
      travelTime: this.gaps
        .filter(gap => gap.type === 'travel')
        .slice(0, 3),
      documentWork: this.gaps
        .filter(gap => gap.type === 'work' || gap.context.toLowerCase().includes('document'))
        .slice(0, 3),
      phoneCalls: this.gaps
        .filter(gap => gap.type === 'call' || gap.context.toLowerCase().includes('call'))
        .slice(0, 3)
    };
  }

  reset() {
    this.firmData = null;
    this.attorneys = [];
    this.calendarEvents = [];
    this.emails = [];
    this.timeEntries = [];
    this.gaps = [];
  }
}

// Singleton instance
let generatorInstance = null;

export const getDemoDataGenerator = () => {
  if (!generatorInstance) {
    generatorInstance = new DemoDataGenerator();
  }
  return generatorInstance;
};

export default DemoDataGenerator;