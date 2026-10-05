import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, ChevronDown, Clock3, Menu, Play, Sparkles, Star, Users, X } from 'lucide-react';

const courses = [
  { title: 'Product design, from zero', category: 'Design', level: 'Beginner friendly', weeks: '8 weeks', price: '$249', image: 'photo-1586717791821-3f44a563fa4c', teacher: 'Maya Lee', rating: '4.9', color: 'lilac' },
  { title: 'The modern marketing playbook', category: 'Marketing', level: 'All levels', weeks: '6 weeks', price: '$199', image: 'photo-1460925895917-afdab827c52f', teacher: 'Jordan Reyes', rating: '4.8', color: 'peach' },
  { title: 'Build with data, think with clarity', category: 'Data', level: 'Intermediate', weeks: '10 weeks', price: '$299', image: 'photo-1551288049-bebda4e38f71', teacher: 'Alex Kim', rating: '5.0', color: 'mint' },
  { title: 'Code your first real-world app', category: 'Development', level: 'Beginner friendly', weeks: '12 weeks', price: '$349', image: 'photo-1498050108023-c5249f4df085', teacher: 'Sam Patel', rating: '4.9', color: 'sky' },
  { title: 'Brand stories that make a mark', category: 'Creative', level: 'All levels', weeks: '5 weeks', price: '$179', image: 'photo-1455390582262-044cdead277a', teacher: 'Em Chen', rating: '4.9', color: 'yellow' },
];
const photo = (id, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function App() {
  const carousel = useRef(null);
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', course: courses[0].title });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const slide = (direction) => {
    const rail = carousel.current;
    const card = rail?.querySelector('.course-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(rail).gap) || 20;
    rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  const enroll = async (event) => {
    event.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch('/api/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Please try again in a moment.');
      setStatus({ state: 'success', message: 'You’re on the list. We’ll be in touch soon!' });
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.72 }, colors: ['#2563EB', '#FBBF24', '#FFFFFF', '#54C4B3'] });
      setForm((current) => ({ ...current, name: '', email: '' }));
    } catch (error) { setStatus({ state: 'error', message: error.message }); }
  };

  return <>
    <header className="site-header">
      <a className="brand" href="#home"><span className="brand-mark"><Sparkles size={18} /></span>nova<span>learn</span></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">{[['Explore', '#courses'], ['Our mentors', '#mentors'], ['Student stories', '#stories'], ['Pricing', '#pricing']].map(([label, href]) => <a href={href} onClick={() => setMenuOpen(false)} key={label}>{label}</a>)}</nav>
      <a className="header-cta" href="#enroll">Find your next thing <ArrowUpRight size={16} /></a>
      <button className="icon-button menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><i /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Learn a little.<br />Do a <span className="yellow-highlight">lot.</span></h1>
          <p className="hero-description">Big career energy, bite-sized into courses you’ll actually finish. Learn from people who’ve been there.</p>
          <div className="hero-actions"><a className="button button-blue" href="#courses">Find your course <ArrowRight size={17} /></a><div className="social-proof"><div className="avatar-stack"><img src={photo('photo-1534528741775-53994a69daeb', 80)} alt="" /><img src={photo('photo-1500648767791-00dcc994a43e', 80)} alt="" /><img src={photo('photo-1531123897727-8f129e1688ce', 80)} alt="" /></div><span><strong>Made for you</strong> and your next move</span></div></div>
          <a className="hero-note" href="#courses"><span><ArrowDown size={15} /></span> Find the skill you’ve been looking for</a>
        </div>
        <div className="hero-art" aria-label="Preview of the NovaLearn student dashboard">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="dashboard-window">
            <div className="dash-topbar"><span className="mini-brand"><span className="brand-mark"><Sparkles size={11} /></span> nova<span>learn</span></span><div className="dash-profile"><i /> On your way <img src={photo('photo-1534528741775-53994a69daeb', 70)} alt="Student profile" /></div></div>
            <div className="dash-body"><aside className="dash-sidebar"><span className="dash-side active"><BarChart3 size={15} /> Overview</span><span className="dash-side"><BookOpen size={15} /> My learning</span><span className="dash-side"><Users size={15} /> Community</span><div className="dash-side-note">YOUR SPACE<br /><b>Keep showing up.</b></div></aside>
              <div className="dash-content"><div className="dash-date">MONDAY, OCTOBER 14</div><h3>Hey, Taylor <span>✦</span></h3><p>A little progress goes a long way.</p>
                <div className="progress-card"><div className="progress-image" style={{ backgroundImage: `url(${photo(courses[0].image, 320)})` }}><span>DESIGN</span></div><div className="progress-info"><small>CONTINUE LEARNING</small><strong>Product design,<br />from zero</strong><div className="progress-track"><i /></div><span>62% complete <b>›</b></span></div></div>
                <div className="dash-stats"><div><small>THIS WEEK</small><strong>4.5 <i>hrs</i></strong><div className="stat-bars">{[30, 50, 40, 75, 52, 90, 58].map((height, i) => <i style={{ height: `${height}%` }} key={i} />)}</div></div><div className="streak-stat"><span>✦</span><div><small>YOUR STREAK</small><strong>5 days</strong></div></div></div>
              </div>
            </div>
          </div>
          <div className="float-card float-streak"><span className="float-icon"><Star size={17} fill="currentColor" /></span><span><strong>5 day streak!</strong><small>You’re on fire</small></span><b>✦</b></div>
          <div className="float-card float-complete"><span className="complete-check"><Check size={15} /></span><span><strong>Lesson complete</strong><small>Look at you go</small></span></div>
          <div className="hero-photo" style={{ backgroundImage: `url(${photo('photo-1522202176988-66273c2fd55f', 420)})` }}><span><Play size={13} fill="currentColor" /> A good day to grow</span></div>
        </div>
      </section>

      <section className="trust-strip"><div className="trust-inner"><span>SKILLS THAT TRAVEL WITH YOU</span><div className="trust-logos"><b>Design</b><b className="serif-logo">Strategy</b><b className="spaced-logo">TECH</b><b>Creative</b><b className="serif-logo">Analytics</b></div></div></section>

      <section className="courses-section section-wrap" id="courses">
        <div className="section-heading reveal"><div><div className="eyebrow"><i /> LEARN SOMETHING THAT MOVES YOU</div><h2>A good place<br />to <span className="blue-word">begin.</span></h2></div><div className="heading-side"><p>Big goals don’t need big leaps. Find a practical, expert-led course and take your next small step.</p><div className="carousel-controls"><button className="icon-button carousel-button" aria-label="Previous courses" onClick={() => slide(-1)}><ArrowLeft size={18} /></button><button className="icon-button carousel-button next" aria-label="Next courses" onClick={() => slide(1)}><ArrowRight size={18} /></button></div></div></div>
        <div className="course-carousel" ref={carousel} onScroll={(event) => { const card = event.currentTarget.querySelector('.course-card'); if (card) setIndex(Math.round(event.currentTarget.scrollLeft / (card.getBoundingClientRect().width + 20))); }}>
          {courses.map((course, i) => <article className={`course-card reveal card-${course.color}`} key={course.title} style={{ '--card-order': i }}><a className="course-image-link" href="#enroll" onClick={() => setForm((old) => ({ ...old, course: course.title }))}><img className="course-image" src={photo(course.image, 760)} alt={`${course.category} course`} loading="lazy" /><span className="course-category">{course.category}</span><span className="course-open"><ArrowUpRight size={17} /></span></a><div className="course-content"><div className="course-meta"><span>{course.level}</span><span><Clock3 size={13} /> {course.weeks}</span></div><h3>{course.title}</h3><div className="course-teacher"><span className="teacher-avatar">{course.teacher.split(' ').map((part) => part[0]).join('')}</span><span>{course.teacher}</span><span className="course-rating"><Star size={13} fill="currentColor" /> {course.rating}</span></div><div className="course-footer"><strong>{course.price}<small> / course</small></strong><a href="#enroll" onClick={() => setForm((old) => ({ ...old, course: course.title }))}>Explore course <ArrowRight size={15} /></a></div></div></article>)}
        </div><div className="carousel-footer"><div className="carousel-progress"><i style={{ width: `${Math.min(100, ((index + 3) / courses.length) * 100)}%` }} /></div><span>{String(Math.min(index + 1, courses.length)).padStart(2, '0')} <i>/</i> 05</span></div>
      </section>

      <section className="manifesto-section"><div className="manifesto-inner section-wrap reveal"><div className="manifesto-photo" style={{ backgroundImage: `url(${photo('photo-1516321318423-f06f85e504b3', 1000)})` }}><span><i /> GOOD THINGS HAPPEN WHEN YOU START</span></div><div className="manifesto-copy"><div className="eyebrow"><i className="yellow-dot" /> THIS IS LEARNING, REIMAGINED</div><h2>Less someday.<br /><span>More “I did it.”</span></h2><p>Forget the 300-page textbook you’ll never open. Get hands-on with skills that matter, taught by people who use them every day.</p><div className="manifesto-stats"><div><strong>Real<span>-world</span></strong><small>hands-on projects</small></div><div><strong>Short<span>&nbsp;and</span></strong><small>focused lessons</small></div><div><strong>Human<span>-led</span></strong><small>expert guidance</small></div></div><a className="text-link" href="#courses">Meet your new favorite subject <ArrowRight size={16} /></a><span className="manifesto-star">✳</span></div></div></section>

      <section className="mentors-section section-wrap" id="mentors"><div className="section-heading reveal"><div><div className="eyebrow"><i /> PEOPLE WHO’VE BEEN THERE</div><h2>Good humans.<br /><span className="blue-word">Great teachers.</span></h2></div><div className="heading-side"><p>No ivory towers here. Just generous experts sharing the real-world things they wish they’d known sooner.</p><a className="text-link" href="#enroll">Learn with them <ArrowRight size={16} /></a></div></div><div className="mentor-grid">{[{ name: 'Maya Lee', role: 'Product designer & educator', image: 'photo-1580489944761-15a19d654956', tag: 'DESIGN THAT WORKS' }, { name: 'Jordan Reyes', role: 'Growth strategist & instructor', image: 'photo-1506794778202-cad84cf45f1d', tag: 'MARKETING, HUMANLY' }, { name: 'Alex Kim', role: 'Data scientist & mentor', image: 'photo-1500648767791-00dcc994a43e', tag: 'MAKE DATA MAKE SENSE' }].map((person, i) => <article className="mentor-card reveal" key={person.name} style={{ '--card-order': i }}><div className="mentor-image"><img src={photo(person.image, 620)} alt={person.name} loading="lazy" /><span className="mentor-tag">{person.tag}</span><a className="mentor-open" href="#enroll" aria-label={`Learn with ${person.name}`}><ArrowUpRight size={17} /></a></div><div className="mentor-info"><div><h3>{person.name}</h3><p>{person.role}</p></div><ArrowUpRight size={19} /></div></article>)}</div></section>

      <section className="stories-section" id="stories"><div className="stories-inner section-wrap reveal"><div className="story-heading"><div className="eyebrow"><i className="yellow-dot" /> REAL PEOPLE, REAL PLOT TWISTS</div><h2>Turns out,<br />you had it <span>in you.</span></h2><p>Small steps. Unexpected doors. Here’s what happens when people give themselves a chance.</p><a className="button button-yellow" href="#enroll">Start your story <ArrowRight size={17} /></a></div><article className="story-card"><span className="quote-mark">“</span><blockquote>I used to think a career change meant starting all over. NovaLearn helped me see I already had the hard part — I just needed to learn how to use it.</blockquote><div className="story-person"><img src={photo('photo-1534528741775-53994a69daeb', 110)} alt="Taylor Morgan" loading="lazy" /><div><strong>Taylor Morgan</strong><span>A fresh start in product design</span></div><span className="story-result"><BookOpen size={15} /> First course complete</span></div><div className="story-course"><BookOpen size={15} /> Finished <strong>Product design, from zero</strong><ArrowUpRight size={15} /></div><span className="story-decoration">✳</span></article><div className="story-index"><b>01</b><i /><span>03</span></div></div></section>

      <section className="pricing-section section-wrap" id="pricing"><div className="pricing-head reveal"><div className="eyebrow"><i /> AN INVESTMENT IN YOURSELF</div><h2>Good learning.<br />No <span className="blue-word">weird surprises.</span></h2><p>Every course includes lifetime access, a real human instructor, and a community in your corner.</p></div><div className="pricing-grid"><article className="price-card reveal"><div className="price-type">THE FIRST STEP <span>01</span></div><h3>One course.<br />One new you.</h3><p>Pick the skill you’ve been curious about and see where it takes you.</p><div className="price-amount"><strong>$179</strong><span>– $349<br />one-time</span></div><a className="button button-outline" href="#enroll">Choose a course <ArrowRight size={16} /></a><ul><li><Check size={15} /> Lifetime access</li><li><Check size={15} /> Project-based learning</li><li><Check size={15} /> Direct instructor feedback</li><li><Check size={15} /> Certificate of completion</li></ul></article><article className="price-card price-featured reveal"><div className="price-type">THE BIG PICTURE <span>02</span></div><div className="popular-badge"><Sparkles size={13} /> MOST FLEXIBLE</div><h3>Keep growing.<br />On your terms.</h3><p>Make learning a habit with every course, whenever you’re ready.</p><div className="price-amount"><strong>$29</strong><span>/ month<br />cancel anytime</span></div><a className="button button-blue" href="#enroll">Get the full pass <ArrowRight size={16} /></a><ul><li><Check size={15} /> Every course, included</li><li><Check size={15} /> New courses each month</li><li><Check size={15} /> Monthly live workshops</li><li><Check size={15} /> A community that gets it</li></ul></article></div><div className="pricing-footnote"><span><Check size={14} /> 7-day satisfaction guarantee</span><span><Check size={14} /> No hidden fees. Ever.</span><a href="#enroll">Questions? We’re real people <ArrowUpRight size={14} /></a></div></section>

      <section className="enroll-section" id="enroll"><div className="enroll-wrap section-wrap"><div className="enroll-copy reveal"><div className="eyebrow"><i className="yellow-dot" /> YOUR MOVE</div><h2>Okay, future<br />you. <span>Let’s go.</span></h2><p>Tell us what you’re curious about. We’ll save you a spot and send the good stuff your way.</p><div className="enroll-proof"><div className="avatar-stack">{['photo-1534528741775-53994a69daeb', 'photo-1500648767791-00dcc994a43e', 'photo-1531123897727-8f129e1688ce'].map((id) => <img key={id} src={photo(id, 80)} alt="" />)}</div><span><strong>12,000+</strong> people already started</span></div><span className="enroll-deco">✳</span></div><form className="enroll-form reveal" onSubmit={enroll}><div className="form-topline"><span>LET’S GET YOU STARTED</span><span>01 <i>—</i> 03</span></div><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="What should we call you?" minLength="2" maxLength="100" required value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setStatus({ state: 'idle', message: '' }); }} /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={(event) => { setForm({ ...form, email: event.target.value }); setStatus({ state: 'idle', message: '' }); }} /><label htmlFor="course">I’m curious about</label><div className="select-wrap"><select id="course" name="course" value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })}>{courses.map((course) => <option key={course.title}>{course.title}</option>)}</select><ChevronDown size={17} /></div><button className="button button-yellow form-submit" type="submit" disabled={status.state === 'loading'}>{status.state === 'loading' ? 'Saving your spot…' : 'Save my spot'} <ArrowRight size={17} /></button><p className={`form-message ${status.state}`} aria-live="polite">{status.message || 'No spam, ever. Just your next good idea.'}</p><div className="form-secure"><span><Check size={13} /> Your details stay yours</span><span>By signing up, you agree to our terms.</span></div></form></div></section>
    </main>

    <footer className="site-footer"><div className="footer-main section-wrap"><div><a className="brand footer-brand" href="#home"><span className="brand-mark"><Sparkles size={18} /></span>nova<span>learn</span></a><p>Make a little progress.<br />Make a lot possible.</p></div><div className="footer-links"><div><b>THE GOOD STUFF</b><a href="#courses">Courses</a><a href="#mentors">Our mentors</a><a href="#pricing">Pricing</a></div><div><b>FIND US</b><a href="#stories">Student stories</a><a href="#enroll">Get in touch</a><a href="#home">Instagram ↗</a></div></div><a className="back-to-top" href="#home" aria-label="Back to top"><ArrowUpRight size={20} /></a></div><div className="footer-bottom section-wrap"><span>© 2026 NovaLearn. Made for the next version of you.</span><span>Terms <i>·</i> Privacy <i>·</i> Accessibility</span><span>Keep growing <b>✳</b></span></div></footer>
  </>;
}

export default App;