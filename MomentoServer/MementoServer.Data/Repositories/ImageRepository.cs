using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core.Entities;
using MomentoServer.Core.IRepositories;

namespace MementoServer.Data.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ImageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddImageAsync(Image image)
        {
            await _context.Images.AddAsync(image);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Image?> GetImageByIdAsync(int id)
        {
            return await _context.Images.FindAsync(id);
        }

        public async Task<List<Image>> GetAllImagesAsync(int userId)
        {
            return await _context.Images.Where(img => img.UserId == userId).ToListAsync();
        }

        public async Task UpdateImageAsync(Image image)
        {
            _context.Images.Update(image);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteImageAsync(Image image)
        {
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
        }

        
    }
}
