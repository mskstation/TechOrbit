
import apiClient from './api';

const USERS_API =
  'https://randomuser.me/api/?results=50&nat=in&seed=techorbit&inc=name,email,phone,location,login,picture';

const companyPrefixes = [
  'Pink City', 'Bharat', 'NextGen', 'Digital India',
  'Blue Lotus', 'CodeCraft', 'SmartTech', 'Pixel',
  'Infinity', 'BrightPath', 'Nova', 'TechBridge',
  'CloudNine', 'FutureWorks', 'WebNest', 'DevSphere',
  'Innovate', 'Quantum', 'Prime', 'Skyline',
];

const companySuffixes = [
  'Technologies', 'Digital Labs', 'Software Studio',
  'Developers', 'Tech Solutions', 'Code Studio',
  'Innovations', 'Systems', 'Digital Works',
  'Engineering Labs',
];

const specializations = [
  'React and frontend development',
  'Full-stack web applications',
  'UI design and accessibility',
  'JavaScript and API integration',
  'Cloud applications and software engineering',
  'Responsive website development',
];

const articles = [
  {
    title: 'Getting Started with React',
    body: 'Learn how components, props and state help build interactive web applications.',
  },
  {
    title: 'Building Responsive Websites',
    body: 'Explore CSS Grid, Flexbox and media queries for responsive layouts.',
  },
  {
    title: 'A Practical Guide to JavaScript',
    body: 'Understand functions, arrays, objects and asynchronous programming.',
  },
  {
    title: 'Understanding REST APIs',
    body: 'Learn how web applications exchange data with API services.',
  },
  {
    title: 'Git and GitHub Essentials',
    body: 'Track code changes and manage collaborative development workflows.',
  },
  {
    title: 'Designing Accessible Interfaces',
    body: 'Improve readability and usability with clear contrast and semantic HTML.',
  },
  {
    title: 'Your First Full-Stack Project',
    body: 'Connect frontend components, backend services and a database.',
  },
  {
    title: 'Debugging React Applications',
    body: 'Read error messages and troubleshoot common component issues.',
  },
  {
    title: 'CSS Layouts Made Simple',
    body: 'Use modern CSS techniques to create clean, adaptable page layouts.',
  },
  {
    title: 'Improving Web App Performance',
    body: 'Explore practical approaches to faster rendering and loading.',
  },
];

// Random User provides generated demo profiles.
// These are NOT verified real developers or verified phone contacts.
const formatIndianPhone = (phone) => {
  if (!phone) return 'Not provided';

  const digits = String(phone).replace(/\D/g, '');

  // Format a 10-digit Indian-style number.
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Handle a number that already contains India's country code.
  if (digits.length === 12 && digits.startsWith('91')) {
    const nationalNumber = digits.slice(2);
    return `+91 ${nationalNumber.slice(0, 5)} ${nationalNumber.slice(5)}`;
  }

  // Do not incorrectly label an unknown number as an Indian number.
  return String(phone);
};

let usersPromise;

const fetchDevelopers = async () => {
  const response = await fetch(USERS_API);

  if (!response.ok) {
    throw new Error(`Developer API failed: ${response.status}`);
  }

  const result = await response.json();

  if (!Array.isArray(result.results)) {
    throw new Error('Invalid response from developer API');
  }

  return result.results.map((user, index) => {
    const firstName = user.name.first;
    const lastName = user.name.last;
    const location = user.location;
    const name = `${firstName} ${lastName}`;
    const username =
      user.login?.username || `developer_${index + 1}`;

    return {
      id: index + 1,
      name,
      username,
      email: user.email,
      phone: formatIndianPhone(user.phone),
      website: `developer${index + 1}.example.com`,
      picture: user.picture?.large || '',
      address: {
        street: `${location.street?.number || ''} ${
          location.street?.name || ''
        }`.trim(),
        suite: 'Demo Profile',
        city: location.city || 'India',
        state: location.state || '',
        zipcode: location.postcode
          ? String(location.postcode)
          : '',
      },
      company: {
        name:
          `${companyPrefixes[index % companyPrefixes.length]} ` +
          companySuffixes[index % companySuffixes.length],
        catchPhrase: 'Building better digital experiences',
        bs: specializations[index % specializations.length],
      },
    };
  });
};

// Cache the response so directory and profile pages use
// the same 50 generated profiles during the session.
const getDevelopers = async () => {
  if (!usersPromise) {
    usersPromise = fetchDevelopers().catch((error) => {
      usersPromise = null;
      throw error;
    });
  }

  return usersPromise;
};

const makePosts = (developers) =>
  developers.flatMap((developer, index) => {
    const firstArticle = index % articles.length;
    const secondArticle = (index + 3) % articles.length;

    return [firstArticle, secondArticle].map(
      (articleIndex, postIndex) => ({
        id: developer.id * 100 + postIndex + 1,
        userId: developer.id,
        title: articles[articleIndex].title,
        body: articles[articleIndex].body,
      })
    );
  });

// Directory: fetches 50 generated profiles from the API.
export const getUsers = async () => {
  const developers = await getDevelopers();

  return {
    data: developers.map((developer) => ({
      ...developer,
      address: { ...developer.address },
      company: { ...developer.company },
    })),
  };
};

// Profile: returns a profile from the same cached API response.
export const getUserById = async (id) => {
  const developers = await getDevelopers();

  const developer = developers.find(
    (item) => item.id === Number(id)
  );

  if (!developer) {
    throw new Error('Developer not found');
  }

  return {
    data: {
      ...developer,
      address: { ...developer.address },
      company: { ...developer.company },
    },
  };
};

// Each profile has two associated demo articles.
export const getUserPosts = async (id) => {
  const developers = await getDevelopers();
  const posts = makePosts(developers);

  return {
    data: posts
      .filter((post) => post.userId === Number(id))
      .map((post) => ({ ...post })),
  };
};

// Keep the existing AddPost form compatible.
export const createPost = (payload) =>
  apiClient.post('/posts', payload);
